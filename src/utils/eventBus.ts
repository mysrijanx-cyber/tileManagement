type EventCallback = (data?: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
    console.log(`📡 EventBus: Listener registered for "${event}"`);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(event, callbacks.filter(cb => cb !== callback));
      console.log(`📡 EventBus: Listener removed for "${event}"`);
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.events.get(event);
    if (callbacks && callbacks.length > 0) {
      console.log(`📡 EventBus: Emitting "${event}" to ${callbacks.length} listener(s)`);
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`❌ EventBus: Error in "${event}" listener:`, error);
        }
      });
    } else {
      console.log(`📡 EventBus: No listeners for "${event}"`);
    }
  }

  clear() {
    this.events.clear();
    console.log('📡 EventBus: All listeners cleared');
  }
}

export const eventBus = new EventBus();

console.log('✅ EventBus initialized');