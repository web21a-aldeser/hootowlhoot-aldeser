const PLAYERS_CARDS_TABLE_ID = 'players-cards';
const TOP = 1;
const VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_TOP = [3, 4, 7, 8];
const BOTTOM = 0;
const VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_BOTTOM = [1, 2, 5, 6];
const FIRST = 0;
class Player {
  constructor(name, dino, row) {
    //this.player = document.getElementById(PLAYER_ID); esto es el div donde esta la imagen
    this.row = row;
    this.colum = FIRST;
    this.currentCell = document.querySelector('td[data-row=' + '"' + row + '"' + '][data-col="0"]');
    this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
    this.previusCell = this.currentCell;
    this.avatar = document.createElement('img');
    this.avatar.src = dino;
    this.prevRow = this.row;
    this.prevCol = this.colum;
    this.name = name;
    this.cards = [];
  }

  // Configure avatar and name in player box
  configurePlayer() {
    //avatar en el tablero
    this.avatar.setAttribute('width', 40);
    this.currentCell.append(this.avatar);

    //elementos del player box
    const tr = document.createElement('tr');
    const dinos = document.createElement('td');
    const img = document.createElement('img');
    img.setAttribute('src', this.avatar.src);
    img.setAttribute('width', 50);
    dinos.append(img);
    tr.append(dinos);
    const playName = document.createElement('td');
    let textName = document.createTextNode(this.name);
    playName.append(textName);
    tr.append(playName);
    const cards = document.createElement('td');
    for (let i = 0; i < 3; i += 1) {
      let card = document.createElement('input');
      card.setAttribute('type', 'image');
      card.setAttribute('width', 50);
      card.setAttribute('height', 50);
      // card.setAttribute('onmouseover', 'image');
      cards.append(card);
    }
    tr.append(cards);
    this.tableBodyElement.append(tr);
    //return tr;
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
      validMovement =
        VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_BOTTOM.indexOf(tentativeMovement) !== -1;
    } else if (where === TOP) {
      validMovement =
        VALID_COLUMNS_FOR_RIGHTWARDS_MOVEMENTS_IN_TOP.indexOf(tentativeMovement) !== -1;
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
    const newCell = this.findCellForPlayersNewPosition();
    this.currentCell.removeChild(this.avatar);
    newCell.appendChild(this.avatar);
    this.currentCell = newCell;
    const finalCell = document.getElementById('final').childElementCount;
  }
}

export {PLAYERS_CARDS_TABLE_ID, BOTTOM, Player};
