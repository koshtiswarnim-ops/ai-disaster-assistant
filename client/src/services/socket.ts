// DisasterOS Real-Time WebSocket Client

type EventHandler = (payload: any) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // When using Vite dev proxy, proxy sends /ws to ws://localhost:5000/ws
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket Client] Connected to DisasterOS Realtime Stream');
        this.isConnecting = false;
        this.emit('STATUS_CHANGE', { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type) {
            this.emit(data.type, data.payload);
            this.emit('*', data); // Wildcard handler
          }
        } catch (err) {
          console.error('[WebSocket Client] Message parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.emit('STATUS_CHANGE', { connected: false });
        // Auto-reconnect after 3 seconds
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket Client] Connection error:', err);
      };
    } catch (e) {
      console.warn('[WebSocket Client] Init exception:', e);
      this.isConnecting = false;
    }
  }

  on(eventType: string, handler: EventHandler) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.off(eventType, handler);
    };
  }

  off(eventType: string, handler: EventHandler) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.delete(handler);
    }
  }

  private emit(eventType: string, payload: any) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.forEach((h) => h(payload));
    }
  }
}

export const socket = new SocketClient();
