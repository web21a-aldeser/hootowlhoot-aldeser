import WaitingRoom from './WaitingRoom.js';
import messagesTypes from './MessagesTypes.js';

const isHostKey = 'isHost';
const websocket = new WebSocket(`ws://${window.location.host}`);
const waitingRoom = new WaitingRoom(websocket);

function main() {
  const amIHost = JSON.parse(localStorage.getItem(isHostKey));

  waitingRoom.configure();
  websocket.onmessage = (event) => {
    processMessage(JSON.parse(event.data));
    configureEventsForPlayersList(waitingRoom);
  };

  if (amIHost === 'true') {
    // Identify myself to the server as host player.
    websocket.onopen = () => {
      console.log('The socket was opened for host player');
      const message = {
        type: 'createSession'
      };
      websocket.send(JSON.stringify(message));
    };
  } else {
    // Guest
    // Identify myself to the server as player.
    disableControlsForGuestPlayer();
    websocket.onopen = () => {
      console.log('The socket was opened for guest player');
      const message = {
        type: 'guestPlayerInitialRequest'
      };
      websocket.send(JSON.stringify(message));
    };
  }
}

function disableControlsForGuestPlayer() {
  document.getElementById('game-private-key').style.display = 'none';
  document.getElementById('geyser-probability').disabled = true;
  document.getElementById('eggs-probability').disabled = true;
  document.getElementById('binoculars-probability').disabled = true;
  document.getElementById('start-match-button').style.display = 'none';
}

function processMessage(message) {
  console.log(message);

  // I have just joined to the session.
  const sessionCreatedByHost = message.type === messagesTypes.sessionCreated;
  const iHaveJoinedToSessionAsGuest = message.type === messagesTypes.guestPlayerSuccessfullyJoined;
  const iHaveJoinedAsHostOrGuest = sessionCreatedByHost || iHaveJoinedToSessionAsGuest;

  // Current players on the session message is received when I have just joined or
  // when a new player joins to the session.
  const newPlayerHasJoined = message.type === messagesTypes.newPlayer;
  const otherPlayerReceived = message.type === messagesTypes.currentPlayers;
  const playersUpdateReceived = newPlayerHasJoined || otherPlayerReceived;

  // Updates on avatar or name.
  const playerNameUpdateReceived = message.type === messagesTypes.playerNameUpdate;
  const playerAvatarUpdated = message.type === messagesTypes.avatarUpdated;

  // Match started.
  const matchHasStarted = message.type === messagesTypes.matchStarted;

  if (iHaveJoinedAsHostOrGuest) {
    addMySelfToTheWaitingRoom(message.value);
  } else if (playersUpdateReceived) {
    addNewPlayerToWaitingRoom(message.value.players);
  } else if (playerNameUpdateReceived) {
    waitingRoom.updatePlayerName(message.value);
  } else if (playerAvatarUpdated) {
    waitingRoom.updatePlayerAvatar(message.value);
  } else if (matchHasStarted) {
    window.location.href = 'arena.xhtml';
  }
}

// This method is executed only the a player joins as host or guest.
function addMySelfToTheWaitingRoom(message) {
  const amIHost = JSON.parse(localStorage.getItem(isHostKey));

  if (amIHost === 'true') {
    const gameKey = document.getElementById('game-private-key');
    gameKey.innerHTML = `Game key: ${message.session_key}`;
  }
  addPlayerToPlayersList(message);
  // It saves this player identity so the next time a socket is created it can
  // be mapped to a session on the server-side.
  const playerIdentity = {
    player_id: message.player_id,
    session_key: message.session_key
  };
  localStorage.setItem(messagesTypes.playerIdentity, JSON.stringify(playerIdentity));
}

function addNewPlayerToWaitingRoom(players) {
  players.forEach((player) => {
    addPlayerToPlayersList(player);
  });
}

function addPlayerToPlayersList(message) {
  const playersTable = document.getElementById('players-table');
  const playerTr = document.createElement('tr');
  // This is used to enable modifications of nickname avatar to this player
  // exclusively.
  playerTr.setAttribute('id', message.player_id);

  // td for player avatar.
  const playerAvatarTd = document.createElement('td');
  playerAvatarTd.setAttribute('id', `player-avatar-${message.player_id}`);
  const playerAvatarButton = document.createElement('button');
  playerAvatarButton.classList.add('avatar-button');
  const playerAvatarImage = document.createElement('img');
  playerAvatarImage.setAttribute('src', message.player_avatar);
  playerAvatarImage.setAttribute('alt', 'elasmosaurus-avatar');
  playerAvatarImage.setAttribute('height', '50');
  playerAvatarImage.setAttribute('width', '50');
  playerAvatarButton.appendChild(playerAvatarImage);
  playerAvatarTd.appendChild(playerAvatarButton);

  // td for player name.
  const playerNameTd = document.createElement('td');
  playerNameTd.setAttribute('id', `player-${message.player_id}-name`);
  playerNameTd.innerHTML = message.player_name;

  playerTr.appendChild(playerAvatarTd);
  playerTr.appendChild(playerNameTd);
  playersTable.appendChild(playerTr);
}

function configureEventsForPlayersList(waitingRoom) {
  waitingRoom.playerList.configurePlayersList(waitingRoom.avatarSelector);
}

window.addEventListener('load', main);
