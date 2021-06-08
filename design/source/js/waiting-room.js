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
class AvatarSelector {
  constructor() {
    this.element = document.getElementById(avatar_selection_id);
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  setPlayersAvatarId(id) {
    this.element.dataset.avatarId = id;
  }
}

const players_table_id = 'players-list-table';
class WaitingRoom {
  constructor() {
    this.avatarSelector = new AvatarSelector();
    this.playerList = new PlayerList(players_table_id);
  }

  configure() {
    this.playerList.configurePlayersList(this.avatarSelector);
  }
}

function main() {
  waitingRoom = new WaitingRoom();
  waitingRoom.configure();
}

window.addEventListener('load', main);