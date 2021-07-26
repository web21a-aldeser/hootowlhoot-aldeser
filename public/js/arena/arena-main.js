import Game from './Game.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const websocket = new WebSocket(`ws://${window.location.host}`);
const game = new Game(websocket);

function main() {
  game.configurePlayersCards();

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
  };

  websocket.onmessage = (event) => {
    processMessage(JSON.parse(event.data));
  };
}

function processMessage(message) {
  console.log(`A message has arrived ${message}`);

  const theMeteoriteHasMoved = message.type === messagesTypes.meteoriteMovement;
  const boardConstructed = message.type === messagesTypes.createBoard;
  const currentTurn = message.type === messagesTypes.currentTurn;

  if (theMeteoriteHasMoved) {
    game.moveMeteorite();
  }
  if(boardConstructed){
    game.createBoard(message);
  }
  if(currentTurn){
    game.chageTurn(message.player_index);
  }
}

window.addEventListener('load', main);
