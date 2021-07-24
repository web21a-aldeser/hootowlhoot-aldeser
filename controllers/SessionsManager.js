import GameSession from '../models/GameSession.js';
import Player from '../models/Player.js';
import messagesTypes from '../utilities/MessagesTypes.js';

const hostPlayerId = 1;

class SessionManager {
  constructor() {
    this.sessions = [];
  }

  createNewSession(socket, webSocketsToPlayers) {
    // It creates a new session and player for host.
    const session = new GameSession();
    const player = new Player(hostPlayerId);
    session.players.push(player);

    // It maps the socket to the player.
    webSocketsToPlayers.set(socket, player);

    // It registers a new session on the server.
    this.sessions.push(session);

    const sessionAndHostIdentity = {
      type: messagesTypes.sessionCreated,
      value: {
        player_id: player.id,
        player_name: player.name,
        session_key: session.key
      }
    };

    // It sends player identity and session key to host player..
    socket.send(JSON.stringify(sessionAndHostIdentity));
  }
}

const sessionManager = new SessionManager();
export default sessionManager;
