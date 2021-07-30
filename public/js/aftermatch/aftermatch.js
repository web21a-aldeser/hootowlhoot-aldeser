export default class AfterMatch {
  constructor() {
    this.status;
  }

  setStatus(){
    this.status = localStorage.getItem('win');
    console.log(this.status);
    const tittle = document.getElementById('title');
    if (this.status === "true"){
      const audio = new Audio('sounds/levelComplete.wav');
      audio.play();
      tittle.innerHTML = 'You Win';
    } else {
      const audio = new Audio('sounds/gameOver.wav');
      audio.play();
      tittle.innerHTML = 'You Lose';
    }
  }
}