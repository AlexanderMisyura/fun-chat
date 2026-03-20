class Emitter<CallbackArgument extends unknown[] = []> {
  private events: Record<string, ((...arguments_: CallbackArgument) => void)[]> = {};

  public on(event: string, listener: (...arguments_: CallbackArgument) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  public off(event: string, listener: (...arguments_: CallbackArgument) => void): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
  }

  public emit(event: string, ...arguments_: CallbackArgument): void {
    if (this.events[event]) {
      for (const listener of this.events[event]) {
        listener(...arguments_);
      }
    }
  }
}

export default Emitter;
