import type { State } from '@ts-enums';
import type { Context, StateDefinition } from '@ts-types';

export type MachineDefinition = {
  initialState: State;
  states: Record<State, StateDefinition>;
  context: Context;
};
