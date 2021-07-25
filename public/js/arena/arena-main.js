import Game from './Game.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const websocket = new WebSocket(`ws://${window.location.host}`);

function main() {
  const game = new Game();
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
}

window.addEventListener('load', main);
