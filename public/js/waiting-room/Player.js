export default class Player {
  constructor(avatarId, nameId, name, avatar, key, playerIdForSession) {
    this.avatarId = avatarId;
    this.nameId = nameId;
    this.avatarElement = document.getElementById(avatarId);
    this.nameElement = document.getElementById(nameId);
    this.name = name;
    this.avatar = avatar;
    this.key = key;
    this.playerIdForSession = playerIdForSession;
  }

  toJson() {
    return {
      player_id: this.key,
      player_name: this.name,
      player_avatar: this.avatar
    };
  }

  updateName(name) {
    this.nameElement.innerHTML = name;
  }

  updateAvatar(path) {
    this.avatarElement.firstChild.firstChild.src = path;
  }
}
