import sessionManager from './SessionsManager.js';
import messagesTypes from '../utilities/MessagesTypes.js';
import broadcaster from '../utilities/Broadcaster.js';

/*class WEbSocketServer {
  changePlayerSocket() { ... }
  playerReady() { ... }
  ...
  }
  
  socket.on('message', (rawMessage) => {
  const message = JSON.parse(rawMessage)
  if (typeof this[message.type] == 'function') {
  this[message.type]();
  }
  });*/

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
        } else if (messageType === messagesTypes.playerNameUpdate) {
          // Update player name
          sessionManager.updatePlayerName(message.value);
          this.broadcastMessage(message, websocket);
        } else if (messageType === messagesTypes.avatarUpdated) {
          // Update avatar name
          sessionManager.updatePlayerAvatar(message.value);
          console.log('Avatar update received');
          this.broadcastMessage(message, websocket);
        } else {
          this.broadcastMessage(message, websocket);
        }
      });

      websocket.on('close', () => {
        console.log(`${this.clientsWebsockets.get(websocket)} closed the connection`);
        this.clientsWebsockets.delete(websocket);
      });
    });
  }

  broadcastMessage(message, websocket) {
    const session = sessionManager.findSessionByKey(message.value.session_key);
    broadcaster.broadcastToAllExcept(session, websocket, message);
  }
}

const webSocketServerManager = new WebSocketServerManager();
export default webSocketServerManager;
