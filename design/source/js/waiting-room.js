/**
 * Players class
 */
class Player {
  constructor(avatarId, nameId) {
    this.avatarId = avatarId;
    this.nameId = nameId;
    this.avatarElement = document.getElementById(avatarId);
    this.nameElement = document.getElementById(nameId);
  }
}

/**
 * Player list
 */
const PLAYER_AVATAR_POS = 0;
const PLAYER_NAME_POS = 1;
class PlayerList {
  constructor(id) {
    this.playersTableId = id;
    this.playersTable = document.getElementById(this.playersTableId);
    this.players = [];
  }

  configurePlayersList(avatarSelector) {
    this.retrieveDataFromPlayersTable();
    this.setupEventsForPlayersList(avatarSelector);
  }

  retrieveDataFromPlayersTable() {
    const players = this.playersTable.rows;
    for (let index = 0; index < players.length; index += 1) {
      const row = players.item(index);
      const player = new Player(row.cells.item(PLAYER_AVATAR_POS).id,
        row.cells.item(PLAYER_NAME_POS).id);
      this.addPlayerToList(player);
    }
  }

  addPlayerToList(player) {
    this.players.push(player);
  }

  setupEventsForPlayersList(avatarSelector) {
    for (let index = 0; index < this.players.length; index += 1) {
      this.players[index].avatarElement.addEventListener('click', () => {
        avatarSelector.show();
        avatarSelector.setPlayersAvatarId(this.players[index].avatarId);
      });
    }
  }
}

/**
 * Avatar selector class
 */
const AVATAR_SELECTION_ID = 'avatar-selection';
const AVATAR_SELECTION_TABLE_ID = 'avatar-selection-table';
const AVATAR_IMAGE_CELL = 1;
const AVATAR_IMAGE_POS = 0;
const AVATAR_BUTTON_CELL = 0;
const AVATAR_SELECTION_BUTTON = 0;
const PLAYERS_AVATAR_CELL = 0;
const PLAYERS_AVATAR_BUTTON = 0;

class AvatarSelector {
  constructor(playersList) {
    this.element = document.getElementById(AVATAR_SELECTION_ID);
    this.element.style.display = 'none';
    this.avatarsTable = document.getElementById(AVATAR_SELECTION_TABLE_ID);
    // Player list is needed to perform player's avatar update.
    this.playersList = playersList;
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  /**
   * Avatar id is necessary to change player's avatar.
   *
   * @param id - The player's avatar id.
   */
  setPlayersAvatarId(id) {
    this.element.dataset.avatarId = id;
  }

  configure() {
    this.setupEvents();
  }

  setupEvents() {
    const avatars = this.avatarsTable.rows;
    for (let index = 0; index < avatars.length; index += 1) {
      const avatarSelectionButton = avatars[index]
        .children[AVATAR_BUTTON_CELL]
        .children.item(AVATAR_SELECTION_BUTTON);

      const avatarImagePath = avatars[index]
        .children[AVATAR_IMAGE_CELL]
        .children.item(AVATAR_IMAGE_POS).src;

      avatarSelectionButton.addEventListener('click', () => {
        document.getElementById(this.element.dataset.avatarId)
          .children[PLAYERS_AVATAR_CELL]
          .children[PLAYERS_AVATAR_BUTTON].src = avatarImagePath;
      });
    }
  }
}

/**
 * Waiting room class
 */
const PLAYER_TABLE_ID = 'players-list-table';
class WaitingRoom {
  constructor() {
    this.playerList = new PlayerList(PLAYER_TABLE_ID);
    this.avatarSelector = new AvatarSelector(this.playersList);
  }

  configure() {
    this.avatarSelector.configure();
    this.playerList.configurePlayersList(this.avatarSelector);
  }
}

function main() {
  const waitingRoom = new WaitingRoom();
  waitingRoom.configure();
}

window.addEventListener('load', main);
