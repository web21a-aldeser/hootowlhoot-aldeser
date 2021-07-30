export default class AfterMatch {
  constructor(websocket) {
    this.status;
    this.turns = 0;
    this.meteorites = 0;
    this.geysers = 0;
  }

  setStatus(){
    this.status = localStorage.getItem('win');
    const tittle = document.getElementById('title');
    if (this.status){
      const audio = new Audio('sounds/levelComplete.wav');
      audio.play();
      tittle.innerHTML = 'You Win';
    } else {
      tittle.innerHTML = 'You Loose';
    }

    // crear tabla
  }
}
