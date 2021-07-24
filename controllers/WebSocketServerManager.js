import sessionManager from './SessionsManager.js';
import messagesTypes from '../utilities/MessagesTypes.js';

class WebSocketServerManager {
  constructor() {
    this.wsServer = null;
    this.clientsWebsockets = new Map();
  }

  configure(wsServer) {
    this.wsServer = wsServer;
    this.wsServer.on('connection', (socket) => {
      socket.on('message', (rawMessage) => {
        // Get message type.
        const message = JSON.parse(rawMessage);
        const messageType = message.type;

        if (messageType === messagesTypes.createSession) {
          sessionManager.createNewSession(socket, this.clientsWebsockets);
        }
      });

      socket.on('close', () => {
        console.log(`${this.clientsWebsockets.get(socket)} closed the connection`);
        this.clientsWebsockets.delete(socket);
      });
    });
  }
}

const webSocketServerManager = new WebSocketServerManager();
export default webSocketServerManager;
