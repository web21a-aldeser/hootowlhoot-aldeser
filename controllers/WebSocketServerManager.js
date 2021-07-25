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
    this.wsServer.on('connection', (websocket) => {
      // ToDo: Handle reconnection after changing to arena.
      websocket.on('message', (rawMessage) => {
        console.log(`Message ${rawMessage}`);
        // Get message type.
        const message = JSON.parse(rawMessage);
        const messageType = message.type;

        if (messageType === messagesTypes.createSession) {
          sessionManager.createNewSession(websocket, this.clientsWebsockets);
        } else if (messageType === messagesTypes.guestPlayerInitialRequest) {
          sessionManager.addPlayerToSession(websocket, this.clientsWebsockets);
        } else if (messageType === messagesTypes.reauthentication) {
          // Reauthenticate websockets
          sessionManager.reattachSocketToPlayer(
            websocket,
            this.clientsWebsockets,
            message.value.player_identity
          );
        } else {
          const session = sessionManager.findSessionByKey(message.value.session_key);
          broadcaster.broadcastToAllExcept(session, websocket, message);
        }
      });

      websocket.on('close', () => {
        console.log(`${this.clientsWebsockets.get(websocket)} closed the connection`);
        this.clientsWebsockets.delete(websocket);
      });
    });
  }
}

const webSocketServerManager = new WebSocketServerManager();
export default webSocketServerManager;
