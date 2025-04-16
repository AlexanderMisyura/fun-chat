import type { StateMachine } from '@state-machine/machine-class';
import type { Transition } from '@ts-enums';
import type { Context } from '@ts-types';

export type MachinePayload = {
  updateContext: StateMachine['updateContext'];
  getFullContext: StateMachine['getFullContext'];
  contextData?: Partial<Context>;
  trigger: Transition;
};
