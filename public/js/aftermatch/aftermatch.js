import messagesTypes from '../waiting-room/MessagesTypes.js';
export default class AfterMatch {
  constructor(websocket) {
    this.status;
    this.turns = 0;
    this.meteorites = 0;
    this.geysers = 0;
  }

  setStatus(){
    this.status = localStorage.getItem('win');
    console.log(this.status);
    const tittle = document.getElementById('title');
    if (this.status === true){
      const audio = new Audio('sounds/levelComplete.wav');
      audio.play();
      tittle.innerHTML = 'You Win';
    } else {
      const audio = new Audio('sounds/gameOver.wav');
      audio.play();
      tittle.innerHTML = 'You Lose';
    }
    
    const stats = localStorage.getItem('stats');

    this.turns = stats.turns;

    turns.innerHTML = stats.turns;

    this.meteors = stats.meteors + message.value.meteors;
    this.geysers = stats.geysers + message.value.geysers;

    meteors.innerHTML = stats.meteors;
    geysers.innerHTML = stats.geysers;
    console.log(stats);
    const message = {
      type: messagesTypes.stats,
      value: stats
    };
    this.websocket.send(JSON.stringify(message));
  }
  
  recieveStats(message){
    console.log(message);
    const stats = localStorage.getItem('stats');
  
    const table = document.getElementById("players-stats");
    const tr = document.createElement('tr');
    const turns = document.createElement('td');
    const meteors = document.createElement('td');
    const geysers = document.createElement('td');
    
    this.turns = stats.turns;

    turns.innerHTML = stats.turns;

    this.meteors = stats.meteors + message.value.meteors;
    this.geysers = stats.geysers + message.value.geysers;

    meteors.innerHTML = stats.meteors;
    geysers.innerHTML = stats.geysers;

    tr.append(turns);
    tr.append(meteors);
    tr.append(geysers);
    table.append(tr);
    // crear tabla
  }
}
