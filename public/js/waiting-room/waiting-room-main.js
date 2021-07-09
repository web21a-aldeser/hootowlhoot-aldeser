import WaitingRoom from './WaitingRoom.js';

function main() {
  const socket = new WebSocket('ws://localhost:3000');
  localStorage.setItem('socket', socket);
  const waitingRoom = new WaitingRoom(socket);
  waitingRoom.configure();
}

window.addEventListener('load', main);
