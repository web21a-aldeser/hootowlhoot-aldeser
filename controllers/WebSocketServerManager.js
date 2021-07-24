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
      console.log('HEY YOU');
      // ToDo: Handle reconnection after changing to arena.
      socket.on('message', (rawMessage) => {
        // Get message type.
        const message = JSON.parse(rawMessage);
        const messageType = message.type;

        if (messageType === messagesTypes.createSession) {
          sessionManager.createNewSession(socket, this.clientsWebsockets);
        } else if (messageType === messagesTypes.guestPlayerInitialRequest) {
          console.log('Guest player has arrived');
          sessionManager.addPlayerToSession(socket, this.clientsWebsockets);
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
