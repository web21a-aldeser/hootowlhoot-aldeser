import AfterMatch from './AfterMatch.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const websocket = new WebSocket(`ws://${window.location.host}`);
const aftermatch = new AfterMatch(websocket);
//const timeForWaitingWebSocketToOpen = 1000;

function main() {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    websocket.onopen = () => {
        console.log('A websocket was has been opened in the aftermatch.');
        const reauthentication = {
            type: messagesTypes.reauthentication,
            value: {
                player_identity: playerIdentity
            }
        };

        websocket.send(JSON.stringify(reauthentication));
        aftermatch.setStatus();
    };

    websocket.onmessage = (event) => {
        processMessage(JSON.parse(event.data));
    };
}


function processMessage(message) {
    console.log(`A message has arrived ${message}`);

}

window.addEventListener('load', main);

