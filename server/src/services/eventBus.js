// DisasterOS Realtime WebSocket Event Bus
import { WebSocketServer, WebSocket } from 'ws';

class EventBus {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws, req) => {
      this.clients.add(ws);
      console.log(`[EventBus] Real-time client connected (${this.clients.size} active)`);

      // Send initial welcome message
      ws.send(JSON.stringify({
        type: 'SYSTEM_CONNECTED',
        payload: {
          message: 'Connected to DisasterOS Real-Time Event Stream',
          timestamp: new Date().toISOString()
        }
      }));

      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed.type === 'PING') {
            ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
          }
        } catch (e) {
          // ignore invalid ping
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[EventBus] Client disconnected (${this.clients.size} remaining)`);
      });

      ws.on('error', (err) => {
        console.error('[EventBus] Socket error:', err.message);
        this.clients.delete(ws);
      });
    });

    console.log('[EventBus] WebSocket server initialized on /ws');
  }

  broadcast(eventType, payload) {
    const message = JSON.stringify({
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    });

    return sentCount;
  }
}

export const eventBus = new EventBus();
