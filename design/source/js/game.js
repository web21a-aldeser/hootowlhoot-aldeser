import Player from './player.js';

const PLAYERS_CARDS_TABLE_ID = 'players-cards';
const CARDS_COUNT = 3;
const CARDS_CELL = 2;
const CARDS = [
    'icons/cards/blue.svg',
    'icons/cards/yellow.svg',
    'icons/cards/red.svg',
    'icons/cards/green.svg',
    'icons/cards/orange.svg',
    'icons/cards/purple.svg',
    'icons/cards/meteorite.svg',
];
const GEYSERLIST = [];
const EGGLIST = [];
const SEELIST = [];
const FIRST = 0;
// const SECOND = 1;

export default class Game {
    constructor() {
        this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
        this.player = new Player();
        this.turn = document.getElementById('turn');
        this.playerList = [];
        this.meteor = document.getElementById('meteor');
    }

    configure() {
        this.getListPlayers();
        this.setFirstTurn();
        this.createGeyser();
        this.createEggs();
        this.createBino();
        this.setupEventsForCards();
    }

    events(src) {
        if (src.indexOf('see') !== -1) {
            // this.player.previusCell = this.player.currentCell;
            // search next
            const audio1 = new Audio('sounds/achivement.wav');
            audio1.play();
        } else if (src.indexOf('egg') !== -1) {
            // this.turn = this.player.name;
            const audio2 = new Audio('sounds/achivement.wav');
            audio2.play();
        } else if (src.indexOf('geyser') !== -1) {
            this.player.currentCell.removeChild(this.player.avatar);
            this.player.previusCell.appendChild(this.player.avatar);
            this.player.currentCell = this.player.previusCell;
            this.player.row = this.player.prevRow;
            this.player.colum = this.player.prevCol;
            // unvalidate cell
            const audio3 = new Audio('sounds/explosion.wav');
            audio3.play();
        }
    }

    setupEventsForCards() {
        const playersCount = this.tableBodyElement.children.length;
        for (let i = 0; i < playersCount; i += 1) {
            const playersCards = this.tableBodyElement.children.item(i).children.item(CARDS_CELL);
            for (let j = 0; j < CARDS_COUNT; j += 1) {
                const card = playersCards.children[j];
                card.addEventListener('click', () => {
                    // ToDo: Implement logic to move dinosaur.
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
                            this.player.currentCell.children[0].style.display = 'block';
                            this.events(this.player.currentCell.children[0].src);
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
        this.turn.innerText = values[FIRST];
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
        this.turn.innerText = values[FIRST];
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
        } else {
            this.meteor.style.position = 'absolute';
            this.meteor.style.left = '850px';
            this.meteor.style.top = '100px';
            window.location = 'aftermatch.xhtml';
        }
    }

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

    randomCell() {
        const num = [0, 2, 4, 6];
        let col;
        const row = Math.floor(Math.random() * 8);
        if (row === 0) {
            num.push(3);
            num.push(7);
            // dependiendo de la cantidad de jugadores este valor cambia
            col = num[Math.floor(Math.random() * 6) + 1];
        } else if (row === 7) {
            num.push(1);
            num.push(5);
            col = num[Math.floor(Math.random() * 6)];
        } else {
            col = num[Math.floor(Math.random() * 4)];
        }
        return document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
    }

    // Creates geysers in random positions in board
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
            GEYSERLIST.push(mine);
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
            EGGLIST.push(egg);
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
            SEELIST.push(bino);
        }
    }
}