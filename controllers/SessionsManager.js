import GameSession from '../models/GameSession.js';
import Player from '../models/Player.js';
import messagesTypes from '../utilities/MessagesTypes.js';
import broadcaster from '../utilities/Broadcaster.js';

const hostPlayerId = 1;
const defaultAvatar = '../../icons/elasmosaurus.svg';

class SessionManager {
  constructor() {
    this.sessions = [];
    // This queue is used to enqueue a session key in which a new player must be
    // assigned. That is a new player has authenticated but it needs to be assign
    // to the session.
    this.sessionsKeysToBeAssigned = [];
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
        session_key: session.key,
        player_avatar: defaultAvatar
      }
    };

    // It sends player identity and session key to host player..
    socket.send(JSON.stringify(sessionAndHostIdentity));
  }

  doesTheSessionExists(sessionKey) {
    const foundSession = this.sessions.find((session) => session.key === sessionKey);
    if (foundSession === undefined) {
      // Deny access to session.
      return false;
    }
    // Grant access to session.
    return true;
  }

  addPlayerToSession(socket, webSocketsToPlayers) {
    const session = this.findSessionByKey(this.sessionsKeysToBeAssigned.shift());
    const player = new Player(session.players.length + 1);

    session.players.push(player);
    webSocketsToPlayers.set(socket, player);

    const guestPlayerIdentity = {
      type: messagesTypes.guestPlayerSuccessfullyJoined,
      value: {
        player_id: player.id,
        player_name: player.name,
        session_key: session.key,
        player_avatar: defaultAvatar
      }
    };

    socket.send(JSON.stringify(guestPlayerIdentity));
    // Send this player via broadcast to all clients.
    this.sendNewPlayerToEveryone(socket, player);

    // Send all other players data to the new player.
  }

  sendNewPlayerToEveryone(socket, player) {
    const newPlayerMessage = {
      type: messagesTypes.newPlayerHasJoined,
      value: {
        player_id: player.id,
        player_name: player.name,
        player_avatar: defaultAvatar
      }
    };

    broadcaster.broadcastToAllExcept(socket, newPlayerMessage);
  }

  findSessionByKey(sessionKey) {
    // It is assumed that the session always exists.
    return this.sessions.find((session) => session.key === sessionKey);
  }

  rememberToAssignPlayerToSession(sessionKey) {
    this.sessionsKeysToBeAssigned.push(sessionKey);
  }
}

const sessionManager = new SessionManager();
export default sessionManager;
