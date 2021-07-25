export default class Player {
  constructor(id) {
    this.name = `Player ${id}`;
    this.id = id;
    this.avatar = '../../icons/elasmosaurus.svg';
  }

  toJSON() {
    return {
      player_id: this.id,
      player_name: this.name,
      player_avatar: this.avatar
    };
  }
}
