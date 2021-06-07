const player_avatar_pos = 0;
const player_name_pos = 1

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
    this.id = id;
    this.playersTable = document.getElementById(this.id);
    this.players = [];
  }

  configurePlayersList() {
    this.retrieveDataFromPlayersTable();
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
    thi.players.push(player);
  }
}

function main() {
  const playerList = new PlayerList('players-list-table');
  playerList.configurePlayersList();
}

window.addEventListener('load', main);