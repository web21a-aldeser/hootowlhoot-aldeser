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
          if (card.src.indexOf('meteorite') !== -1) {
            this.meteorite();
          }
          card.src = this.getRandomCard();
        });
      }
    }
  }

  meteorite() {
    const meteor = document.getElementById('meteor');
    const computedStyles = window.getComputedStyle(meteor);
    console.log(`computedStyles.left = ${computedStyles.left}`);
    meteor.style.left = `${parseInt(computedStyles.left, 10) + 50}px`;
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

class Player {
  constructor() {
    this.player = document.getElementById(PLAYER_ID);
    this.row = 0;
    this.colum = 0;
    this.currentCell = document.querySelector('td[data-row="0"][data-col="0"]');
  }

  configurePlayer() {
    this.player.addEventListener('click', () => {
      this.move();
    });
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

class BoardCell {
  constructor(row, colum) {
    this.row = row;
    this.colum = colum;
    this.cell = document.querySelector(`td[data-row="${this.row}"][data-col="${this.colum}"]`);
    this.color = this.cell.className;
  }

  isAvailable() {
    const hasChildren = this.cell.hasChildNodes();
    return hasChildren;
  }
}

class Board {
  constructor() {
    this.board = new Map();
  }

  configureBoard() {
    this.setUpInternalBoard();
    console.log(this.board);
  }

  setUpInternalBoard() {
    this.board.set('00', new BoardCell(0, 0));
    this.board.set('10', new BoardCell(1, 0));
    this.board.set('20', new BoardCell(2, 0));
    this.board.set('30', new BoardCell(3, 0));
    this.board.set('40', new BoardCell(4, 0));
    this.board.set('50', new BoardCell(5, 0));
    this.board.set('60', new BoardCell(6, 0));

    this.board.set('70', new BoardCell(7, 0));
    this.board.set('71', new BoardCell(7, 1));
    this.board.set('72', new BoardCell(7, 2));

    this.board.set('62', new BoardCell(6, 2));
    this.board.set('52', new BoardCell(5, 2));
    this.board.set('42', new BoardCell(4, 2));
    this.board.set('32', new BoardCell(3, 2));
    this.board.set('22', new BoardCell(2, 2));
    this.board.set('12', new BoardCell(1, 2));

    this.board.set('02', new BoardCell(0, 2));
    this.board.set('03', new BoardCell(0, 3));
    this.board.set('04', new BoardCell(0, 4));

    this.board.set('14', new BoardCell(1, 4));
    this.board.set('24', new BoardCell(2, 4));
    this.board.set('34', new BoardCell(3, 4));
    this.board.set('44', new BoardCell(4, 4));
    this.board.set('54', new BoardCell(5, 4));
    this.board.set('64', new BoardCell(6, 4));

    this.board.set('74', new BoardCell(7, 4));
    this.board.set('75', new BoardCell(7, 5));
    this.board.set('76', new BoardCell(7, 6));

    this.board.set('66', new BoardCell(6, 6));
    this.board.set('56', new BoardCell(5, 6));
    this.board.set('46', new BoardCell(4, 6));
    this.board.set('36', new BoardCell(3, 6));
    this.board.set('26', new BoardCell(2, 6));
    this.board.set('16', new BoardCell(1, 6));

    this.board.set('06', new BoardCell(0, 6));
    this.board.set('07', new BoardCell(0, 7));
    this.board.set('08', new BoardCell(0, 8));
  }

  traverseBoard() {
    for (const [key, value] of this.board) {
      console.log(`${key} = ${value.color}`);
    }
  }

  discoverNextAvailableBoardCellOfColor(color) {

  }
}

function main() {
  const playersCards = new PlayersCards();
  playersCards.configurePlayersCards();
  const player = new Player();
  player.configurePlayer();

  const board = new Board();
  board.configureBoard();
  board.traverseBoard();
}

window.addEventListener('load', main);
