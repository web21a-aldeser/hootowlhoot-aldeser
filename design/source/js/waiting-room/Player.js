export default class Player {
  constructor(avatarId, nameId, name, avatar, key) {
    this.avatarId = avatarId;
    this.nameId = nameId;
    this.avatarElement = document.getElementById(avatarId);
    this.nameElement = document.getElementById(nameId);
    this.name = name;
    this.avatar = avatar;
    this.key = key;
  }
}
