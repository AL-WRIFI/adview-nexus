
import Pusher from 'pusher-js';

class PusherService {
  private pusher: Pusher | null = null;
  private channel: any = null;

  initialize() {
    if (!this.pusher) {
      this.pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || 'default-key', {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
        forceTLS: true,
      });
    }
    return this.pusher;
  }

  subscribe(channelName: string) {
    if (!this.pusher) {
      this.initialize();
    }
    
    this.channel = this.pusher?.subscribe(channelName);
    return this.channel;
  }

  unsubscribe(channelName: string) {
    if (this.pusher) {
      this.pusher.unsubscribe(channelName);
    }
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
    }
  }

  bind(eventName: string, callback: (data: any) => void) {
    if (this.channel) {
      this.channel.bind(eventName, callback);
    }
  }

  unbind(eventName: string) {
    if (this.channel) {
      this.channel.unbind(eventName);
    }
  }
}

export const pusherService = new PusherService();
