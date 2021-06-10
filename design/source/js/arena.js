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
  'icons/cards/meteorite.svg'];

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
          card.src = this.getRandomCard();
        });
      }
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
class Player {
  constructor() {
    this.player = document.getElementById(PLAYER_ID);
    this.row = 0;
    this.colum = 0;
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
    this.findCellForPlayersNewPosition();
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
      this.colum += 1
    } else {
      const upwardsMovement = this.colum === 2 || this.colum === 6; 
      const downwardsMovement = this.colum === 4;
      if (upwardsMovement) {
        this.moveUpwards();
      } else if (downwardsMovement) {
        this.moveDownwards();
      }
    }
  }

  findCellForPlayersNewPosition() {
    const newPos = `td[data-row="${this.row}"] td[data-col="${this.colum}"]`;
    console.log(newPos);
  }
}

function main() {
  const playersCards = new PlayersCards();
  playersCards.configurePlayersCards();
  const player = new Player();
  player.configurePlayer();
}

window.addEventListener('load', main);
