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
    this.onTurn = true; // To test...
  }

  destinationReached(row, colum) {
    return this.row === row && this.colum === colum;
  }

  getPlayerPosition() {
    return `${this.row}${this.colum}`;
  }

  async moveToDestination(row, colum) {
    while (!this.destinationReached(row, colum)) {
      this.move();
      await delay(1000);
    }
  }

  configurePlayer() {
    this.player.addEventListener('click', () => {
      this.move();
    });
    // It is initialized on true for test purposes.
    this.onTurn = true;
  }

  isOnTurn() {
    return this.onTurn;
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

    // Rerturn this.row
  }
}

class BoardCell {
  constructor(row, colum) {
    this.row = row;
    this.colum = colum;
    this.mappingCell = `${this.row}${this.colum}`;
    this.cell = document.querySelector(`td[data-row="${this.row}"][data-col="${this.colum}"]`);
    this.color = this.cell.className;
  }

  isAvailable() {
    // ToDo: Consider the cases where the parent html element has another child such as geysers.
    // In that case, this will not work, for the cell will be available (no dinosaur in there), but 
    // there will be an obstacle (ie a child nodes).
    return !this.cell.hasChildNodes();
  }

  getCoordinate() {
    return `${this.row}${this.colum}`;
  }
}

class Board {
  constructor() {
    this.board = new Map();
    this.flattenedGameBoard = [];
    this.players = [];
  }

  configureBoard() {
    this.setUpInternalBoard();
    console.log(this.board);
  }

  setUpInternalBoard() {
    this.board.set('00', 0);
    this.flattenedGameBoard.push(new BoardCell(0, 0));

    this.board.set('10', 1);
    this.flattenedGameBoard.push(new BoardCell(1, 0));

    this.board.set('20', 2);
    this.flattenedGameBoard.push(new BoardCell(2, 0));

    this.board.set('30', 3);
    this.flattenedGameBoard.push(new BoardCell(3, 0));

    this.board.set('40', 4);
    this.flattenedGameBoard.push(new BoardCell(4, 0));

    this.board.set('50', 5);
    this.flattenedGameBoard.push(new BoardCell(5, 0));

    this.board.set('60', 6);
    this.flattenedGameBoard.push(new BoardCell(6, 0));

    this.board.set('70', 7);
    this.flattenedGameBoard.push(new BoardCell(7, 0));

    this.board.set('71', 8);
    this.flattenedGameBoard.push(new BoardCell(7, 1));

    this.board.set('72', 9);
    this.flattenedGameBoard.push(new BoardCell(7, 2));

    this.board.set('62', 10);
    this.flattenedGameBoard.push(new BoardCell(6, 2));

    this.board.set('52', 11);
    this.flattenedGameBoard.push(new BoardCell(5, 2));

    this.board.set('42', 12);
    this.flattenedGameBoard.push(new BoardCell(4, 2));

    this.board.set('32', 13);
    this.flattenedGameBoard.push(new BoardCell(3, 2));

    this.board.set('22', 14);
    this.flattenedGameBoard.push(new BoardCell(2, 2));

    this.board.set('12', 15);
    this.flattenedGameBoard.push(new BoardCell(1, 2));

    this.board.set('02', 16);
    this.flattenedGameBoard.push(new BoardCell(0, 2));

    this.board.set('03', 17);
    this.flattenedGameBoard.push(new BoardCell(0, 3));

    this.board.set('04', 18);
    this.flattenedGameBoard.push(new BoardCell(0, 4));

    this.board.set('14', 19);
    this.flattenedGameBoard.push(new BoardCell(1, 4));

    this.board.set('24', 20);
    this.flattenedGameBoard.push(new BoardCell(2, 4));

    this.board.set('34', 21);
    this.flattenedGameBoard.push(new BoardCell(3, 4));

    this.board.set('44', 22);
    this.flattenedGameBoard.push(new BoardCell(4, 4));

    this.board.set('54', 23);
    this.flattenedGameBoard.push(new BoardCell(5, 4));

    this.board.set('64', 24);
    this.flattenedGameBoard.push(new BoardCell(6, 4));

    this.board.set('74', 25);
    this.flattenedGameBoard.push(new BoardCell(7, 4));

    this.board.set('75', 26);
    this.flattenedGameBoard.push(new BoardCell(7, 5));

    this.board.set('76', 27);
    this.flattenedGameBoard.push(new BoardCell(7, 6));

    this.board.set('66', 28);
    this.flattenedGameBoard.push(new BoardCell(6, 6));

    this.board.set('56', 29);
    this.flattenedGameBoard.push(new BoardCell(5, 6));

    this.board.set('46', 30);
    this.flattenedGameBoard.push(new BoardCell(4, 6));

    this.board.set('36', 31);
    this.flattenedGameBoard.push(new BoardCell(3, 6));

    this.board.set('26', 32);
    this.flattenedGameBoard.push(new BoardCell(2, 6));

    this.board.set('16', 33);
    this.flattenedGameBoard.push(new BoardCell(1, 6));

    this.board.set('06', 34);
    this.flattenedGameBoard.push(new BoardCell(0, 6));

    this.board.set('07', 35);
    this.flattenedGameBoard.push(new BoardCell(0, 7));

    this.board.set('08', 36);
    this.flattenedGameBoard.push(new BoardCell(0, 8));
  }

  traverseBoard() {
    for (const [key, value] of this.board) {
      console.log(`${key} = ${this.flattenedGameBoard[value].color}`);
    }
  }

  /**
   * This method determines the next available board cell with the target color
   * starting from the player's current position in the flattened game board
   * representation.
   * 
   * @param {*} currentPosition The position in the form 'rowcolum' where the 
   *                            player's avatar is currently positioned.
   *                            For instance '71' means that the player is 
   *                            positioned on row = 7 and colum = 1.
   *
   * @param {*} targetColor The color of the next available cell where the 
   *                        player wants to move its avatar to.
   */
  discoverNextAvailableBoardCellFromOfColor(currentPosition, targetColor) {
    const startIndexForFlattenedGameBoard = this.board.get(currentPosition);

    for (let index = startIndexForFlattenedGameBoard;
      index < this.flattenedGameBoard.length; index += 1) {
        
      const boardCell = this.flattenedGameBoard[index];
      const cellWithTargetColorFound = boardCell.color === targetColor;
      if (cellWithTargetColorFound) {
        if (boardCell.isAvailable()) {
          // Return the board cell.

          // From here code must executed by a movePlayerToNextAvailablePosition(color);
          // Determine elegant way to find the player who is on turn.
          for (let i = 0; i < this.players.length; i += 1) {
            const player = this.players[i];
            if (player.isOnTurn()) {
              // Move player until it reaches the available position.
              // It must use the player.move method internally.
              player.moveToDestination(boardCell.row, boardCell.colum);
            }
          }
        }
      }
    }
  }
}

class GameOrchestrator {
  constructor(board,
    player) {
    this.board = board;
    this.player = player;
  }

  play() {
    for (let index = 0; index < 5; index++) {
      this.board.discoverNextAvailableBoardCellFromOfColor(
        this.player.getPlayerPosition(),
        'green');
    }
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
  board.players.push(player);

  orchestrator = new GameOrchestrator(board, player);
  orchestrator.play();
}

window.addEventListener('load', main);
