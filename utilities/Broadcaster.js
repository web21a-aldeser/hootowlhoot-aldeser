class Broadcaster {
  constructor() {
    this.wsServer = null;
  }

  broadcastToEveryone(message) {
    this.wsServer.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastToAllExcept(socket, message) {
    this.wsServer.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const broadcaster = new Broadcaster();
export default broadcaster;
