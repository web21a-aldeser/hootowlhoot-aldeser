import WaitingRoom from './WaitingRoom.js';
import PlayerList from './PlayerList.js';

const isHostKey = 'isHost';
const messagesTypes = {
  sessionCreated: 'sessionCreated',
  playerIdentity: 'playerIdentity'
};

function main() {
  const socket = new WebSocket(`ws://${window.location.host}`);
  const amIHost = JSON.parse(localStorage.getItem(isHostKey));
  const waitingRoom = new WaitingRoom(socket);
  waitingRoom.configure();

  if (amIHost) {
    // Identify myself to the server as host player.
    socket.onopen = () => {
      console.log('The socket was opened');
      const message = {
        type: 'createSession'
      };
      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      processMessage(JSON.parse(event.data));
      // In the meantime this configuration is here. It must be moved to another place.
      waitingRoom.playerList.configurePlayersList(waitingRoom.avatarSelector);
    };
  } else {
    // Identify myself to the server as player.
  }
}

function processMessage(message) {
  const sessionCreated = message.type === messagesTypes.sessionCreated;

  if (sessionCreated) {
    updateWaitingRoom(message.value);
  }
}

function updateWaitingRoom(message) {
  const gameKey = document.getElementById('game-private-key');
  gameKey.innerHTML = `Game key: ${message.session_key}`;
  addPlayerToPlayersList(message);

  // It saves this player identity so the next time a socket is created it can
  // be mapped to a session on the server-side.
  const playerIdentity = {
    sessionId: message.session_key,
    playerId: message.player_id
  };

  localStorage.setItem(messagesTypes, JSON.stringify(playerIdentity));
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
  playerAvatarImage.setAttribute('src', '../../icons/elasmosaurus.svg');
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

window.addEventListener('load', main);
