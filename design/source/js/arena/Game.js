/* eslint-disable no-case-declarations */
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
    this.player = new Player();
    this.playerList = [];
    this.geyserList = [];
    this.eggList = [];
    this.binoList = [];
    this.turn = document.getElementById('turn');
    this.meteor = document.getElementById('meteor');
    this.currentList = [];
  }

  configurePlayersCards() {
    this.getListPlayers();
    this.setFirstTurn();
    this.createGeyser();
    this.createEggs();
    this.createBino();
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
  objectActions(src, card) {
    switch (true) {
      // caso de binoculares, permite ver geysers por un tiempo determinado
      case (src.indexOf('see') !== -1):
        this.player.currentCell.children[0].style.display = 'block';
        // this.player.previusCell = this.player.currentCell;
        this.showGeysers();
        const list = this.currentList;
        setTimeout(() => {
          for (let i = 0; i < list.length; i += 1) {
            list[i].style.display = 'none';
          }
        }, 1000);
        const audio1 = new Audio('sounds/achivement.wav');
        audio1.play();
        break;

        // caso de huevos, duplican turno
      case (src.indexOf('egg') !== -1):
        this.player.currentCell.children[0].style.display = 'block';
        // this.turn = this.player.name;
        const audio2 = new Audio('sounds/achivement.wav');
        audio2.play();
        break;

        // caso de geyser, el jugador vuelve a su posicion inicial
        // si escoge un color que ya tenia un geyser descubierto lo salta al siguiente color
      case (src.indexOf('geyser') !== -1):
        // caso de que el geyser ya este descubierto en el color al que escogio
        if (this.player.currentCell.children[0].style.display === 'block') {
          let color = this.player.currentCell.className;
          do {
            this.player.move();
            color = this.player.currentCell.className;
          } while (card.src.indexOf(color) === -1);
        } else {
          const geyser = this.player.currentCell.children[0];
          geyser.style.display = 'block';
          geyser.style.filter = 'brightness(1.75)';
          this.player.avatar.style.filter = 'brightness(0)';
          setTimeout(() => {
            geyser.style.filter = 'brightness(1)';
            this.player.avatar.style.filter = 'brightness(1)';
          }, 1000);
          this.player.currentCell.removeChild(this.player.avatar);
          this.player.currentCell = this.player.previusCell;
          this.player.previusCell.appendChild(this.player.avatar);
          this.player.row = this.player.prevRow;
          this.player.colum = this.player.prevCol;
          // unvalidate cell
          const audio3 = new Audio('sounds/explosion.wav');
          audio3.play();
        }
        break;

      default:
        break;
    }
    /*
        if (src.indexOf('see') !== -1) {
          this.player.currentCell.children[0].style.display = 'block';
          // this.player.previusCell = this.player.currentCell;
          this.showGeysers();
          const list = this.currentList;
          setTimeout(() => {
            for (let i = 0; i < list.length; i += 1) {
              list[i].style.display = 'none';
            }
          }, 1000);
          const audio1 = new Audio('sounds/achivement.wav');
          audio1.play();
        } else if (src.indexOf('egg') !== -1) {
          this.player.currentCell.children[0].style.display = 'block';
          // this.turn = this.player.name;
          const audio2 = new Audio('sounds/achivement.wav');
          audio2.play();
        } else if (src.indexOf('geyser') !== -1) {
          if (this.player.currentCell.children[0].style.display === 'block') {
            let color = this.player.currentCell.className;
            do {
              this.player.move();
              color = this.player.currentCell.className;
            } while (card.src.indexOf(color) === -1);
          } else {
            const geyser = this.player.currentCell.children[0];
            geyser.style.display = 'block';
            geyser.style.filter = 'brightness(1.75)';
            this.player.avatar.style.filter = 'brightness(0)';
            setTimeout(() => {
              geyser.style.filter = 'brightness(1)';
              this.player.avatar.style.filter = 'brightness(1)';
            }, 1000);
            this.player.currentCell.removeChild(this.player.avatar);
            this.player.currentCell = this.player.previusCell;
            this.player.previusCell.appendChild(this.player.avatar);
            this.player.row = this.player.prevRow;
            this.player.colum = this.player.prevCol;
            // unvalidate cell
            const audio3 = new Audio('sounds/explosion.wav');
            audio3.play();
          }
        }
        */
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
            let color = this.player.currentCell.className;
            this.player.previusCell = this.player.currentCell;
            do {
              this.player.move();
              color = this.player.currentCell.className;
            } while (card.src.indexOf(color) === -1);

            if (this.player.currentCell.children[0].src != null) {
              this.objectActions(this.player.currentCell.children[0].src, card);
            } else {
              this.player.previusCell = this.player.currentCell;
            }
            this.player.prevCol = this.player.colum;
            this.player.prevRow = this.player.row;
          }
          this.chageTurn(i);
          card.src = this.getRandomCard();
        });
      }
    }
  }

  setFirstTurn() {
    const retrive = localStorage.getItem(0);
    const values = JSON.parse(retrive);
    this.turn.innerText = values[BOTTOM];
  }

  chageTurn(index) {
    let playersLength = JSON.parse(localStorage.getItem('players-quantity'));
    playersLength -= 1;
    if (index < playersLength) {
      this.index += 1;
    } else {
      this.index = 0;
    }

    const retrive = localStorage.getItem(index);
    const values = JSON.parse(retrive);
    this.turn.innerText = values[BOTTOM];
  }

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

  // eslint-disable-next-line class-methods-use-this
  getRandomCard() {
    return CARDS[Math.floor(Math.random() * CARDS.length)];
  }

  getListPlayers() {
    for (let i = 0; i < JSON.parse(localStorage.getItem('players-quantity')); i += 1) {
      const player = new Player();
      player.configurePlayer(i);
      this.playerList.push(player);
    }
  }

  // asigna una celda aleatoria para la insercion de los objetos
  // eslint-disable-next-line class-methods-use-this
  randomCell() {
    // arreglo de los numeros de columnas del tablero
    // ya que estas son las que cambian respecto a las filas en nuestro tablero

    const validCol = [0, 2, 4, 6];
    let col = 0;

    // sacamos una fila aleatoria para asignar los numeros de columna
    // válidos según cual fila sea
    const row = Math.floor(Math.random() * 8);
    if (row === 0) {
      validCol.push(3);
      validCol.push(7);

      // dependiendo de la cantidad de jugadores este valor cambia
      // ya que los jugadores se posicionan en las primeras casillas
      col = validCol[Math.floor(Math.random() * 6) + 1];
      while (col === undefined) {
        col = validCol[Math.floor(Math.random() * 6) + 1];
      }
    } else if (row === 7) {
      validCol.push(1);
      validCol.push(5);
      col = validCol[Math.floor(Math.random() * 6)];
    } else {
      col = validCol[Math.floor(Math.random() * 4)];
    }
    return document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
  }

  createGeyser() {
    const geyserTotal = JSON.parse(localStorage.getItem('Geysers'));
    for (let i = 0; i < geyserTotal; i += 1) {
      // crear elementos imagenes y se le asigna el icono que es
      const mine = document.createElement('img');
      mine.src = 'icons/geyser.svg';
      mine.width = '60';
      mine.style.position = 'absolute';
      // se asignas las posiciones aleatoria a los geysers
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
      // crear elementos imagenes y se le asigna el icono que es
      const egg = document.createElement('img');
      egg.src = 'icons/egg.svg';
      egg.width = '50';
      egg.style.position = 'absolute';
      // Asigna posiciones, mientras la celda tenga un objeto buscara otra que este vacia
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
