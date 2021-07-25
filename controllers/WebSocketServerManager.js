import sessionManager from './SessionsManager.js';
import messagesTypes from '../utilities/MessagesTypes.js';
import broadcaster from '../utilities/Broadcaster.js';

class WebSocketServerManager {
  constructor() {
    this.wsServer = null;
    this.clientsWebsockets = new Map();
  }

  configure(wsServer) {
    this.wsServer = wsServer;
    this.wsServer.on('connection', (socket) => {
      // ToDo: Handle reconnection after changing to arena.
      socket.on('message', (rawMessage) => {
        console.log(`Message ${rawMessage}`);
        // Get message type.
        const message = JSON.parse(rawMessage);
        const messageType = message.type;

        if (messageType === messagesTypes.createSession) {
          sessionManager.createNewSession(socket, this.clientsWebsockets);
        } else if (messageType === messagesTypes.guestPlayerInitialRequest) {
          sessionManager.addPlayerToSession(socket, this.clientsWebsockets);
        } else {
          broadcaster.broadcastToAllExcept(socket, message);
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
