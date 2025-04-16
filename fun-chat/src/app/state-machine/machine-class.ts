import type { State, Transition } from '@ts-enums';
import type { Context, MachineDefinition, MachinePayload } from '@ts-types';

import Emitter from './event-emitter-machine';

export class StateMachine {
  public value: MachineDefinition['initialState'];
  public context: MachineDefinition['context'];
  public readonly eventsMap: Emitter['eventsMap'];
  private emitter: Emitter = new Emitter();
  private definition: MachineDefinition;

  constructor(stateMachineDefinition: MachineDefinition) {
    this.eventsMap = this.emitter.eventsMap;
    this.definition = stateMachineDefinition;
    this.value = stateMachineDefinition.initialState;
    this.context = stateMachineDefinition.context;
  }

  public makeTransition(
    currentState: State,
    trigger: Transition,
    contextData?: Partial<Context>
  ): string | void {
    const currentStateDefinition = this.definition.states[currentState];
    const destinationTransition = currentStateDefinition.transitions[trigger];

    if (!destinationTransition) return;

    const destinationState = destinationTransition.target;
    const destinationStateDefinition = this.definition.states[destinationState];

    const payload: MachinePayload = {
      updateContext: this.updateContext.bind(this),
      getFullContext: this.getFullContext.bind(this),
      contextData,
      trigger,
    };

    destinationTransition.action?.(payload);
    currentStateDefinition.actions.onExit?.(payload);
    destinationStateDefinition.actions.onEnter?.(payload);

    this.value = destinationState;
    this.emit(this.eventsMap.machineStateChanged, payload);

    console.log(
      `machine has changed state from ${currentState} to ${destinationState} with trigger ${trigger}`
    );

    return this.value;
  }

  public updateContext(contextData: Partial<Context>): void {
    this.context = { ...this.context, ...contextData };
  }

  public getFullContext(): Context {
    return this.context;
  }

  public on(event: string, callback: (payload: MachinePayload, ...other: unknown[]) => void): void {
    this.emitter.on(event, callback);
  }

  public emit(event: string, payload: MachinePayload, ...other: unknown[]): void {
    this.emitter.emit(event, payload, ...other);
  }
}
