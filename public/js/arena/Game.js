import { PLAYERS_CARDS_TABLE_ID, BOTTOM, Player } from './Player.js';

const CARDS_CELL = 2;
const CARDS_COUNT = 3;

const CARDS = [
  'icons/cards/blue.svg',
  'icons/cards/yellow.svg',
  'icons/cards/red.svg',
  'icons/cards/green.svg',
  'icons/cards/orange.svg',
  'icons/cards/purple.svg',
  'icons/cards/meteorite.svg',
];

export default class Game {
  constructor() {
    this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
    this.playerList = [];
    this.geyserList = [];
    this.eggList = [];
    this.binoList = [];
    this.turn = document.getElementById('turn');
    this.meteor = document.getElementById('meteor');
    this.currentList = [];
    this.currentPlayer = 0;
  }

  configurePlayersCards() {
    this.getListPlayers();
    this.setFirstTurn();
    this.createGeyser();
    this.createEggs();
    this.createBino();
    const pass = document.getElementById('pass');
    pass.addEventListener('click', () => {
      this.chageTurn(this.currentPlayer);
    });
    this.setupEventsForCards();
  }

  showGeysers() {
    this.currentList = [];
    for (let i = 0; i < this.geyserList.length; i += 1) {
      if (this.geyserList[i].style.display === 'none') {
        this.geyserList[i].style.display = 'block';
        this.currentList.push(this.geyserList[i]);
      }
    }
  }

  // evalua el objeto en el que el jugador cae para ejecutar su determinada accion
  objectActions(src, card, index) {
    switch (true) {
      // caso de binoculares, permite ver geysers por un tiempo determinado
      case (src.indexOf('see') !== -1):
        this.playerList[index].currentCell.children[0].style.display = 'block';
        // this.player.previusCell = this.player.currentCell;
        this.showGeysers();
        const list = this.currentList;
        setTimeout(() => {
          for (let i = 0; i < list.length; i += 1) {
            list[i].style.display = 'none';
          }
        }, 10000);
        const audio1 = new Audio('sounds/achivement.wav');
        audio1.play();
        break;

        // caso de huevos, duplican turno
      case (src.indexOf('egg') !== -1):
        this.playerList[index].currentCell.children[0].style.display = 'block';
        // this.turn = this.player.name;
        const audio2 = new Audio('sounds/achivement.wav');
        audio2.play();
        break;

        // caso de geyser, el jugador vuelve a su posicion inicial
        // si escoge un color que ya tenia un geyser descubierto lo salta al siguiente color
      case (src.indexOf('geyser') !== -1):
        // caso de que el geyser ya este descubierto en el color al que escogio
        if ( this.playerList[index].currentCell.children[0].style.display === 'block') {
          let color =  this.playerList[index].currentCell.className;
          do {
            this.playerList[index].move();
            color =  this.playerList[index].currentCell.className;
          } while (card.src.indexOf(color) === -1);
        } else {
          const geyser =  this.playerList[index].currentCell.children[0];
          geyser.style.display = 'block';
          geyser.style.filter = 'brightness(1.75)';
          this.playerList[index].avatar.style.filter = 'brightness(0)';
          setTimeout(() => {
            geyser.style.filter = 'brightness(1)';
            this.playerList[index].avatar.style.filter = 'brightness(1)';
          }, 1000);
          this.playerList[index].currentCell.removeChild( this.playerList[index].avatar);
          this.playerList[index].currentCell =  this.playerList[index].previusCell;
          this.playerList[index].previusCell.appendChild( this.playerList[index].avatar);
          this.playerList[index].row =  this.playerList[index].prevRow;
          this.playerList[index].colum =  this.playerList[index].prevCol;
          // unvalidate cell
          const audio3 = new Audio('sounds/explosion.wav');
          audio3.play();
        }
        break;

      default:
        break;
    }
  }

  setupEventsForCards() {
    const playersCount = this.tableBodyElement.children.length;
    for (let i = 0; i < playersCount; i += 1) {
      const playersCards = this.tableBodyElement.children.item(i).children.item(CARDS_CELL);
      for (let j = 0; j < CARDS_COUNT; j += 1) {
        const card = playersCards.children[j];
        card.addEventListener('click', () => {
          if (card.src.indexOf('meteorite') !== -1) {
            this.meteorite();
          } else {
            // 
            let color = this.playerList[i].currentCell.className;
            // this.playerList[i].previusCell = this.playerList[i].currentCell;
            this.playerList[i].previusCell =this.playerList[i].currentCell;
            do {
              // this.playerList[i].move();
              this.playerList[i].move();
              // this.playerList[i].currentCell.classname;
              color = this.playerList[i].currentCell.className;
            } while (card.src.indexOf(color) === -1);
            if (this.playerList[i].currentCell.children[0].src != null) {
              this.objectActions(this.playerList[i].currentCell.children[0].src, card, i);
            } else {
              this.playerList[i].previusCell = this.playerList[i].currentCell;
            }
            this.playerList[i].prevCol = this.playerList[i].colum;
            this.playerList[i].prevRow = this.playerList[i].row;
          }
          this.chageTurn(i);
          card.src = this.getRandomCard();
        });
      }
    }
  }

  // pone el primer turno al empezar la partida
  setFirstTurn() {
    this.turn.innerText =this.playerList[0].name;
  }

  // cambia de turno 
  chageTurn(index) {
    
    if (index < this.playerList.length - 1) {
      index += 1;
    } else {
      index = 0;
    }
    //const retrive = localStorage.getItem(index);
    //const values = JSON.parse(retrive);
    this.turn.innerText = this.playerList[index].name;
    this.currentPlayer = index;
  }

  //mueve el meteorito cada vez que sale una carta
  meteorite() {
    const proximity = document.getElementById('clarity');
    const elements = proximity.children;

    let index;
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].children.length === 1) {
        index = i;
      }
    }
    if (index !== elements.length - 1) {
      elements[index].removeChild(this.meteor);
      elements[index + 1].appendChild(this.meteor);
      const audio1 = new Audio('sounds/meteor.wav');
      audio1.play();
    } else {
      this.meteor.style.position = 'absolute';
      this.meteor.style.left = '850px';
      this.meteor.style.top = '100px';
      window.location = 'aftermatch.xhtml';
    }
  }

  // retorna una carta al azar
  // eslint-disable-next-line class-methods-use-this
  getRandomCard() {
    return CARDS[Math.floor(Math.random() * CARDS.length)];
  }

  // pasa la lista de jugadores falta
  getListPlayers() {
    const localList=JSON.parse(localStorage.getItem('players'));
    // crea y configura los jugadores
    for (let i = 0; i < localList.length; i += 1) {
      const player = new Player(localList[i].name, localList.avatar, i);
      player.configurePlayer();
      this.playerList.push(player);
      const playersCards = this.tableBodyElement.children.item(i).children.item(CARDS_CELL);
      for (let j = 0; j < CARDS_COUNT; j += 1) {
        const card = playersCards.children[j];
        card.src = this.getRandomCard();
    }
  }
}

  // eslint-disable-next-line class-methods-use-this
  randomCell() {
    const num = [0, 2, 4, 6];
    let col = 0;
    const row = Math.floor(Math.random() * 8);
    if (row === 0) {
      num.push(3);
      num.push(7);
      // dependiendo de la cantidad de jugadores este valor cambia
      col = num[Math.floor(Math.random() * 6) + 1];
      while (col === undefined) {
        col = num[Math.floor(Math.random() * 6) + 1];
      }
    } else if (row === 7) {
      num.push(1);
      num.push(5);
      col = num[Math.floor(Math.random() * 6)];
    } else {
      col = num[Math.floor(Math.random() * 4)];
    }
    return document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
  }

  createGeyser() {
    const geyserTotal = JSON.parse(localStorage.getItem('Geysers'));
    for (let i = 0; i < geyserTotal; i += 1) {
      // create geysers
      const mine = document.createElement('img');
      mine.src = 'icons/geyser.svg';
      mine.width = '60';
      mine.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell();
      while (newCell.children.length !== 0) {
        newCell = this.randomCell();
      }
      newCell.appendChild(mine);
      const computedStyles = window.getComputedStyle(mine);
      mine.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
      mine.style.left = `${parseInt(computedStyles.left, 10) + 20}px`;
      mine.style.display = 'none';
      this.geyserList.push(mine);
    }
  }

  createEggs() {
    const eggsTotal = JSON.parse(localStorage.getItem('Eggs'));

    for (let i = 0; i < eggsTotal; i += 1) {
      // create egg
      const egg = document.createElement('img');
      egg.src = 'icons/egg.svg';
      egg.width = '50';
      egg.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell();
      while (newCell.children.length !== 0) {
        newCell = this.randomCell();
      }
      newCell.appendChild(egg);
      const computedStyles = window.getComputedStyle(egg);
      egg.style.top = `${parseInt(computedStyles.top, 10) - 20}px`;
      egg.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
      egg.style.display = 'none';
      this.eggList.push(egg);
    }
  }

  createBino() {
    const binoTotal = JSON.parse(localStorage.getItem('Binoculars'));

    for (let i = 0; i < binoTotal; i += 1) {
      // create Binoculars
      const bino = document.createElement('img');
      bino.src = 'icons/see.svg';
      bino.width = '50';
      bino.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell();
      while (newCell.children.length !== 0) {
        newCell = this.randomCell();
      }
      newCell.appendChild(bino);
      const computedStyles = window.getComputedStyle(bino);
      bino.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
      bino.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
      bino.style.display = 'none';
      this.binoList.push(bino);
    }
  }
}
