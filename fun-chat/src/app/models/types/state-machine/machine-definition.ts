import type { Context, StateDefinition } from '@ts-types';

export type MachineDefinition = {
  initialState: string;
  states: Record<string, StateDefinition>;
  context: Context;
};
