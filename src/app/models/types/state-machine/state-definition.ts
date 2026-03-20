import type { State, Transition } from '@ts-enums';
import type { MachinePayload } from '@ts-types';

export type StateDefinition = {
  actions: {
    onEnter?(payload: MachinePayload): void;
    onExit?(payload: MachinePayload): void;
  };
  transitions: {
    [key in Transition]?: {
      target: State;
      action?(payload: MachinePayload): void;
    };
  };
};
