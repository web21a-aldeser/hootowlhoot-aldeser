import GameSession from '../models/GameSession.js';
import Player from '../models/Player.js';
import messagesTypes from '../utilities/MessagesTypes.js';
import broadcaster from '../utilities/Broadcaster.js';

const hostPlayerId = 1;
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
    session.clients.push(socket);

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
        player_avatar: player.avatar
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
    session.clients.push(socket);

    const player = new Player(session.players.length + 1);

    session.players.push(player);
    webSocketsToPlayers.set(socket, player);

    const guestPlayerIdentity = {
      type: messagesTypes.guestPlayerSuccessfullyJoined,
      value: {
        player_id: player.id,
        player_name: player.name,
        session_key: session.key,
        player_avatar: player.avatar
      }
    };

    // Send all other players data to the new player.
    this.sendCurrentSessionPlayersToNewPlayer(socket, session, player.id);

    socket.send(JSON.stringify(guestPlayerIdentity));

    // Send this player via broadcast to all clients.
    this.sendNewPlayerToEveryone(session, socket, player);
  }

  reattachSocketToPlayer(websocket, clientsWebsockets, playerIdentity) {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const session = this.findSessionByKey(playerIdentity.session_key);
    const player = session.findPlayerById(playerIdentity.player_id);
    // It saves the websocket for broadcasting purposes.
    session.clients.push(websocket);
    // This map is not in use yet.
    clientsWebsockets.set(websocket, player);

    console.log('Websocket trace successfully recovered');
  }

  sendNewPlayerToEveryone(session, socket, player) {
    const newPlayerMessage = {
      type: messagesTypes.newPlayerHasJoined,
      value: {
        player_id: player.id,
        player_name: player.name,
        player_avatar: player.avatar
      }
    };

    broadcaster.broadcastToAllExcept(session, socket, newPlayerMessage);
  }

  sendCurrentSessionPlayersToNewPlayer(socket, session, newPlayerId) {
    const currentPlayersOnWaitingRoom = {
      type: messagesTypes.currentPlayers,
      value: {
        players: []
      }
    };

    session.players.forEach((player) => {
      if (player.id !== newPlayerId) {
        currentPlayersOnWaitingRoom.value.players.push(player.toJSON());
      }
    });

    socket.send(JSON.stringify(currentPlayersOnWaitingRoom));
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
