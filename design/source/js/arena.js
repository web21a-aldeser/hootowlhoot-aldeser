/* eslint-disable class-methods-use-this */
const PLAYERS_CARDS_TABLE_ID = 'players-cards';
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
const PLAYER_ID = 'player-1-avatar';
const TOP = 1;
const VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_TOP = [3, 4, 7, 8];
const BOTTOM = 0;
const VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_BOTTOM = [1, 2, 5, 6];
const FIRST = 0;
const SECOND = 1;

class Player {
    constructor() {
        this.player = document.getElementById(PLAYER_ID);
        this.row = FIRST;
        this.colum = FIRST;
        this.currentCell = document.querySelector('td[data-row="0"][data-col="0"]');
        this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
        this.previusCell = this.currentCell;
        this.avatar = this.currentCell.children.item(0);
        this.prevRow = this.row;
        this.prevCol = this.colum;
    }

    // Configure avatar and name in player box
    configurePlayer(key) {
        const playerName = this.tableBodyElement.children.item(FIRST).children.item(SECOND);
        // eslint-disable-next-line max-len
        const playerDino = this.tableBodyElement.children.item(FIRST).children.item(FIRST).children[FIRST];
        const retrive = localStorage.getItem(parseInt(key, 10));
        const values = JSON.parse(retrive);
        playerName.innerHTML = values[FIRST];
        playerDino.src = values[SECOND];
        this.player.children[FIRST].src = values[SECOND];
    }

    move() {
        const downwardsMovement = this.colum === 0 || this.colum === 4;
        const upwardsMovement = this.colum === 2 || this.colum === 6;
        const rightwardsMovementBottom = this.row === 7;
        const rightwardsMovementTop = this.row === 0 && this.colum > 0;

        if (rightwardsMovementBottom) {
            this.moveRightwards(BOTTOM);
        } else if (rightwardsMovementTop) {
            this.moveRightwards(TOP);
        } else if (downwardsMovement) {
            this.moveDownwards();
        } else if (upwardsMovement) {
            this.moveUpwards();
        }
        window.setTimeout(this.movePlayerAvatarToNewCell(), 2000);
    }

    moveDownwards() {
        const bottomReached = this.row === 7;
        if (bottomReached) {
            this.moveRightwards(BOTTOM);
        } else {
            this.row += 1;
        }
    }

    moveUpwards() {
        const topReached = this.row === 0;
        if (topReached) {
            this.moveRightwards(TOP);
        } else {
            this.row -= 1;
        }
    }

    moveRightwards(where) {
        const tentativeMovement = this.colum + 1;
        let validMovement = false;
        if (where === BOTTOM) {
            validMovement = VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_BOTTOM
                .indexOf(tentativeMovement) !== -1;
        } else if (where === TOP) {
            validMovement = VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_TOP
                .indexOf(tentativeMovement) !== -1;
        }
        if (validMovement) {
            this.colum += 1;
        } else {
            const bottomEndReached = this.colum === 2 || this.colum === 6;
            const topEndReached = this.colum === 4;
            if (bottomEndReached) {
                this.moveUpwards();
            } else if (topEndReached) {
                this.moveDownwards();
            }
        }
    }

    findCellForPlayersNewPosition() {
        return document.querySelector(`td[data-row="${this.row}"][data-col="${this.colum}"]`);
    }

    movePlayerAvatarToNewCell() {
        // ToDo: check whether the new cell is inhabit for another dinosaur or if it
        // contains a geyser.
        const newCell = this.findCellForPlayersNewPosition();
        this.currentCell.removeChild(this.avatar);
        newCell.appendChild(this.avatar);
        this.currentCell = newCell;
        if (this.currentCell === document.getElementById('final')) {
            window.location = 'aftermatch.xhtml';
        }
    }
}

class PlayersCards {
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

    events(src) {
        if (src.indexOf('see') !== -1) {
            // this.player.previusCell = this.player.currentCell;
            // search next
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
            // this.turn = this.player.name;
            const audio2 = new Audio('sounds/achivement.wav');
            audio2.play();
        } else if (src.indexOf('geyser') !== -1) {
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
            // const list = [];
            // list.push(mine);
            // list.push(newCell.dataset.row);
            // list.push(newCell.dataset.col);
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

function main() {
    const playersCards = new PlayersCards();
    playersCards.configurePlayersCards();
}

window.addEventListener('load', main);
