import WaitingRoom from './WaitingRoom.js'

function main() {
    const waitingRoom = new WaitingRoom();
    waitingRoom.configure();
}

window.addEventListener('load', main);
