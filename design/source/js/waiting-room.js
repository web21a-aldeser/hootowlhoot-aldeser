const player_avatar_pos = 0;
const player_name_pos = 1


/*
* On avatar clicked, set modal data attribute to player-avatar-n
* On modal image clicked, get data attribute for player-avatar and change image
* path with clicked avatar.
*/

class Player {
  constructor(avatarId, nameId) {
    this.avatarId = avatarId;
    this.nameId = nameId;
    this.avatarElement = document.getElementById(avatarId);
    this.nameElement = document.getElementById(nameId);
  }
}
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
    let players = this.playersTable.rows;
    for (let index = 0; index < players.length; index++) {
      const row = players.item(index);
      const player = new Player(row.cells.item(player_avatar_pos).id,
        row.cells.item(player_name_pos).id);
      this.addPlayerToList(player);
    }
  }

  addPlayerToList(player) {
    this.players.push(player);
  }

  setupEventsForPlayersList(avatarSelector) {
    for (let index = 0; index < this.players.length; index++) {
      this.players[index].avatarElement.addEventListener('click', () => {
        avatarSelector.show();
        avatarSelector.setPlayersAvatarId(this.players[index].avatarId);
      });
    }
  }
}

const avatar_selection_id = 'avatar-selection';
const avatar_selection_table_id = 'avatar-selection-table';
const avatar_image_cell = 1;
const avatar_image_pos = 0;
const avatar_button_cell = 0;
const avatar_selection_button = 0;
const players_avatar_cell = 0;
const players_avatar_button = 0;
class AvatarSelector {
  constructor(playersList) {
    this.element = document.getElementById(avatar_selection_id);
    this.element.style.display = 'none';
    this.avatarsTable = document.getElementById(avatar_selection_table_id);
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
    let avatars = this.avatarsTable.rows;
    for (let index = 0; index < avatars.length; index++) {
      let avatarSelectionButton =
        avatars[index]
          .children[avatar_button_cell]
          .children.item(avatar_selection_button);

      let avatarImagePath =
        avatars[index]
          .children[avatar_image_cell]
          .children.item(avatar_image_pos).src;

      avatarSelectionButton.addEventListener('click', () => {
          document.getElementById(this.element.dataset.avatarId)
            .children[players_avatar_cell]
            .children[players_avatar_button].src = avatarImagePath;
      });
    }
  }
}

const players_table_id = 'players-list-table';
class WaitingRoom {
  constructor() {
    this.playerList = new PlayerList(players_table_id);
    this.avatarSelector = new AvatarSelector(this.playersList);
  }

  configure() {
    this.avatarSelector.configure();
    this.playerList.configurePlayersList(this.avatarSelector);
  }
}

function main() {
  waitingRoom = new WaitingRoom();
  waitingRoom.configure();
}

window.addEventListener('load', main);