import type { MachinePayload } from '@ts-types';
import Emitter from '@utils/event-emitter-generic';

class EmitterMachine extends Emitter<[MachinePayload, ...unknown[]]> {
  public readonly eventsMap = {
    machineStateChanged: 'machineStateChanged',
    contextChanged: 'contextChanged',
  } as const;
}

export default EmitterMachine;
