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
    }

    configurePlayersCards() {
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
                    }
                    card.src = this.getRandomCard();
                });
            }
        }
    }

    meteorite() {
        const meteor = document.getElementById("meteor");
        const computedStyles = window.getComputedStyle(meteor);
        console.log(`computedStyles.left = ${computedStyles.left}`);
        meteor.style.left = (parseInt(computedStyles.left, 10) + 50) + "px";
    }

    getRandomCard() {
        return CARDS[Math.floor(Math.random() * CARDS.length)];
    }
}

function main() {
    const playersCards = new PlayersCards();
    playersCards.configurePlayersCards();
}

window.addEventListener('load', main);