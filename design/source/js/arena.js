const player_start_row = 0;
const player_start_col = 0;

const game_board_rows = 8;
const game_board_cols = 8;

class Cell {
    constructor(id, color) {
        this.geyser = false;
        this.egg = false;
        this.binoculars = false;
        this.color = color;
    }
}

class Board {
    constructor(id) {
        this.id = id;
        let arr = new Array(game_board_cols);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(game_board_rows);
        }
        for (let i = 0; i < game_board_cols; i++) {
            for (let j = 0; j < game_board_rows; j++) {
                arrp[i][j] = new Cell()
            }
        }
    }

}

class Player {
    constructor(avatarId, nameId) {
        this.avatarId = avatarId;
        this.nameId = nameId;
        this.avatarElement = document.getElementById(avatarId);
        this.nameElement = document.getElementById(nameId);
        this.row = parseInt(this.element.dataset.row, 10);
        this.col = parseInt(this.element.dataset.col, 10);
    }

    //busca el color
    //mueve a ese color
    move(color)
}

class Card {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
}
class Player {
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(id);
        console.assert(this.element);
        // this.row = player_start_row;
        // this.col = player_start_col;
        this.row = parseInt(this.element.dataset.row, 10);
        this.col = parseInt(this.element.dataset.col, 10);
        this.move(0, 0);
        this.element.addEventListener('click', (event) => {
            console.assert(event);
            this.move(0, -1);
            this.element.classList.add('active_player');
            window.setTimeout(() => {
                this.element.classList.remove('active_player');
            }, 4000);
        });
    }

    move(delta_rows, delta_cols) {
        const computedStyles = window.getComputedStyle(this.element);
        console.log(`computedStyles.left = ${computedStyles.left}`);

        console.log(`move player 1 from (${this.row}, ${this.col})`);
        this.row += delta_rows;
        this.col += delta_cols;
        console.log(`move player 1 to (${this.row}, ${this.col})`);
        const row_percent = 100.0 * this.row / game_board_rows;
        const col_percent = 100.0 * this.col / game_board_cols;
        console.log(`this.element.style.left = (${this.element.style.left})`);
        this.element.style.top = `${row_percent}%`;
        this.element.style.left = `${col_percent}%`;
        console.log(`this.element.style.left = (${this.element.style.left})`);

        console.log(`computedStyles.left = ${computedStyles.left}`);
    }
}

class Game {
    constructor() {}

    setupEvents() {
        this.player1 = new Player('player1');
        this.setupHelp();
    }

    setupHelp() {
        const button = document.getElementById('toggle_help');
        button.addEventListener('click', () => {
            const help = document.getElementById('help');
            if (help.style.display === 'none') {
                help.style.display = 'block';
            } else {
                help.style.display = 'none';
            }
        });
    }
}

function main() {
    const game = new Game();
    game.setupEvents();
}

window.addEventListener('load', main);