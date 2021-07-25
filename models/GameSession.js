const keyLength = 15;
export default class GameSession {
  constructor() {
    this.key = this.generateRandomGameKey(keyLength);
    this.players = [];
    this.clients = [];
  }

  generateRandomGameKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  findPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }
}
