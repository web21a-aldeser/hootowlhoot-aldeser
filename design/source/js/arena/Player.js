const PLAYERS_CARDS_TABLE_ID = 'players-cards';
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

export {PLAYERS_CARDS_TABLE_ID, BOTTOM, Player};
