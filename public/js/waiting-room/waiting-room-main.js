import WaitingRoom from './WaitingRoom.js';

function main() {
  const socket = new WebSocket(`ws://${window.location.host}`);
  const waitingRoom = new WaitingRoom(socket);
  waitingRoom.configure();
}

window.addEventListener('load', main);