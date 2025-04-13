import type { MachinePayload } from '@ts-types';
import Emitter from '@utils/event-emitter-generic';

class EmitterMachine extends Emitter<[MachinePayload, ...unknown[]]> {}

export default EmitterMachine;
