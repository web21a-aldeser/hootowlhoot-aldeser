import Game from './Game.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const websocket = new WebSocket(`ws://${window.location.host}`);
const game = new Game(websocket);
const timeForWaitingWebSocketToOpen = 1000;

function main() {
  // Player identity reference { player_id: message.player_id, session_key: message.session_key }
  const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

  websocket.onopen = () => {
    console.log('A websocket was has been opened in the arena.');
    const reauthentication = {
      type: messagesTypes.reauthentication,
      value: {
        player_identity: playerIdentity
      }
    };

    websocket.send(JSON.stringify(reauthentication));

    // Request initial board configuration.
    const initialBoardMessage = {
      type: messagesTypes.requestBoard,
      value: {
        session_key: playerIdentity.session_key
      }
    };
    websocket.send(JSON.stringify(initialBoardMessage));
    createBoard();
  };

  websocket.onmessage = (event) => {
    processMessage(JSON.parse(event.data));
  };
}

function createBoard() {
  const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));
  game.configurePlayersCards(parseInt(JSON.stringify(playerIdentity.player_id)));

  if (parseInt(JSON.stringify(playerIdentity.player_id)) == 1) {
    console.log('made it here');
    game.sendCreationEventToServer();
  }
}

function processMessage(message) {
  console.log(`A message has arrived ${message}`);

  const theMeteoriteHasMoved = message.type === messagesTypes.meteoriteMovement;
  const boardConstructed = message.type === messagesTypes.createBoard;
  const currentTurn = message.type === messagesTypes.currentTurn;
  const syncCards = message.type === messagesTypes.cardSync;
  const playerHasMoved = message.type === messagesTypes.movementInfo;
  const checkWin = message.type === messagesTypes.checkWin;
  const checkLose = message.type === messagesTypes.checkLose;
  if (syncCards) {
    game.receiveCardsUpdateFromServer(message);
    console.log(message);
  }
  if (theMeteoriteHasMoved) {
    game.moveMeteorite();
  }
  if (boardConstructed) {
    game.createArena(message);
    console.log(message);
  }
  if (currentTurn) {
    game.receiveTurnUpdate(message.value.player_index);
  }
  if (playerHasMoved) {
    game.movePlayer(message);
  }
  if (checkWin) {
    localStorage.setItem('win', true);
    console.log(game.stats, 'stats');
    localStorage.setItem('stats', JSON.stringify(game.stats));
    game.receiveCheckWin(message.value.win);
  }
  if (checkLose) {
    localStorage.setItem('win', false);
    localStorage.setItem('stats', JSON.stringify(game.stats));
    window.location.href = 'aftermatch';
  }
}

window.addEventListener('load', main);
