import Game from './Game.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const websocket = new WebSocket(`ws://${window.location.host}`);
const game = new Game(websocket);

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
    //game = new Game(websocket);

    websocket.send(JSON.stringify(reauthentication));
  };

  websocket.onmessage = (event) => {
    processMessage(JSON.parse(event.data));
  };

  setTimeout(() => {
    createBoard();
  }, 5000);
  
  
}

function createBoard(){
  const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));
  game.configurePlayersCards(parseInt(JSON.stringify(playerIdentity.player_id)));

  if(parseInt(JSON.stringify(playerIdentity.player_id)) == 1){
    console.log("made it here");
    game.sendCreationEventToServer();
  }
}

function processMessage(message) {
  console.log(`A message has arrived ${message}`);

  const theMeteoriteHasMoved = message.type === messagesTypes.meteoriteMovement;
  const boardConstructed = message.type === messagesTypes.createBoard;
  const currentTurn = message.type === messagesTypes.currentTurn;
  const syncCards = message.type === messagesTypes.cardSync;
  if (syncCards){
    game.recieveCardsUpdate(message);
    console.log(message);
  }
  if (theMeteoriteHasMoved) {
    game.moveMeteorite();
  }
  if(boardConstructed){
    game.createArena(message);
    console.log(message);
  }
  if(currentTurn){
    game.chageTurn(message.player_index);
  }
}

window.addEventListener('load', main);
