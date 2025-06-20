//TEMPORARY TO IMMITATE
type Callback = (data: any) => void;

class FakeSocket {
  private events: Record<string, Callback[]> = {};

  emit(event: string, data?: any) {
    // For testing, you can trigger callbacks directly or do nothing
    console.log(`[FakeSocket] emit: ${event}`, data);
    // Simulate receiving a newComment after sending addComment
    if (event === "addComment") {
      setTimeout(() => {
        this.trigger("newComment", data.text);
      }, 500);
    }
  }

  on(event: string, callback: Callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  off(event: string, callback?: Callback) {
    if (!callback) {
      this.events[event] = [];
    } else {
      this.events[event] =
        this.events[event]?.filter((cb) => cb !== callback) || [];
    }
  }

  trigger(event: string, data?: any) {
    this.events[event]?.forEach((cb) => cb(data));
  }
}

export const socket = new FakeSocket();
