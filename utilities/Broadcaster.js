import WebSocket from 'ws';
class Broadcaster {
  constructor() {
    this.wsServer = null;
  }

  configure(wsServer) {
    this.wsServer = wsServer;
  }

  broadcastToEveryone(session, message) {
    session.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  broadcastToAllExcept(session, socket, message) {
    session.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

const broadcaster = new Broadcaster();
export default broadcaster;
