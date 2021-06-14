const PLAYERS_CARDS_TABLE_ID = 'players-cards';
const CARDS_CELL = 2;
const CARDS_COUNT = 3;
const player_start_row = 0;
const player_start_col = 0;

const game_board_rows = 8;
const game_board_cols = 8;

const CARDS = [
    'icons/cards/blue.svg',
    'icons/cards/yellow.svg',
    'icons/cards/red.svg',
    'icons/cards/green.svg',
    'icons/cards/orange.svg',
    'icons/cards/purple.svg',
    'icons/cards/meteorite.svg'
];


class PlayersCards {
    constructor() {
        this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
        this.player = new Player();

    }

    configurePlayersCards() {
        this.setFirstTurn();
        this.setupEventsForCards();
    }

    setupEventsForCards() {
        const playersCount = this.tableBodyElement.children.length;
        for (let i = 0; i < playersCount; i += 1) {
            const playersCards = this.tableBodyElement.children.item(i).children.item(CARDS_CELL);
            for (let j = 0; j < CARDS_COUNT; j += 1) {
                const card = playersCards.children[j];
                card.addEventListener('click', () => {
                    // ToDo: Implement logic to move dinosaur.
                    if (card.src.indexOf('meteorite') != -1) {
                        this.meteorite();
                    } else {
                        this.player.move();
                    }
                    console.log('index');
                    console.log(i);

                    this.chageTurn(i);
                    card.src = this.getRandomCard();
                });
            }
        }
    }

    setFirstTurn() {
        let turn = document.getElementById('turn');
        let retrive = localStorage.getItem(0);
        let values = JSON.parse(retrive);
        turn.innerText = values[0];
    }

    chageTurn(index) {
        let turn = document.getElementById('turn');
        let playersLength = JSON.parse(localStorage.getItem("players-quantity"));
        playersLength = playersLength - 1;
        if (index < playersLength) {
            index++;
        } else {
            index = 0;
        }

        let retrive = localStorage.getItem(index);
        let values = JSON.parse(retrive);
        turn.innerText = values[0];
    }

    meteorite() {
        const meteor = document.getElementById("meteor");
        const computedStyles = window.getComputedStyle(meteor);
        console.log(`computedStyles.left = ${computedStyles.left}`);
        meteor.style.left = (parseInt(computedStyles.left, 10) + 50) + "px";
        if ((parseInt(computedStyles.left, 10)) >= 790) {
            window.location = "aftermatch.xhtml";
        }
    }

    getRandomCard() {
        return CARDS[Math.floor(Math.random() * CARDS.length)];
    }
}

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
    }

    configurePlayer() {
        const playerName = this.tableBodyElement.children.item(FIRST).children.item(SECOND);
        const playerDino = this.tableBodyElement.children.item(FIRST).children.item(FIRST).children[FIRST];

        let index = localStorage.getItem("index");
        let retrive = localStorage.getItem(parseInt(index));

        let values = JSON.parse(retrive);
        console.log(this.player.children[0].src);
        playerName.innerHTML = values[0];
        playerDino.src = values[1];
        this.player.children[0].src = values[1];
        //this.player.addEventListener('click', () => {
        //  this.move();
        //});
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
        this.movePlayerAvatarToNewCell();
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

        let playerAvatar = null;
        const thereIsAnElementInTheCell = this.currentCell.childElementCount > 1;
        if (thereIsAnElementInTheCell) {
            playerAvatar = this.currentCell.children.item(1);
        } else {
            playerAvatar = this.currentCell.children.item(0);
        }
        this.currentCell.removeChild(playerAvatar);
        newCell.appendChild(playerAvatar);
        this.currentCell = newCell;
    }
}


function getListPlayers() {
    const playerList = [];
    console.log(JSON.parse(localStorage.getItem("players-quantity")));
    for (let i = 0; i < JSON.parse(localStorage.getItem("players-quantity")); i++) {
        localStorage.setItem("index", i);
        const player = new Player();
        player.configurePlayer();
        playerList.push(player);
    }
    console.log(playerList);
    return playerList;

}
const GEYSERLIST = [];
const CELLS = 36;

function createGeyser() {
    let num = (localStorage.getItem('Geysers'));
    num = JSON.parse(num);
    const geyserTotal = (num * CELLS) / 100;
    //posiciones iniciales
    let posLeft = 60;
    let posTop = 100;
    for (let i = 0; i < geyserTotal; i++) {
        //crea imagenes con estilos
        let mine = document.createElement("img");
        mine.src = 'icons/geyser.svg';
        mine.width = '50';
        mine.style.position = 'absolute';
        mine.style.display = 'block';
        //Asignar posiciones
        mine.style.left = posLeft + "px";
        mine.style.top = posTop + 'px';
        posTop += 50;
        posLeft += 50;
        //
        var wrapper = document.getElementById('tablero');
        wrapper.appendChild(mine);
        GEYSERLIST.push(mine);
    }
}


function main() {
    const playersCards = new PlayersCards();
    playersCards.configurePlayersCards();
    const playerList = this.getListPlayers();;
    //const player = new Player();
    //player.configurePlayer();
    createGeyser();

}

window.addEventListener('load', main);