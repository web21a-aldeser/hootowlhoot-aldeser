const keyLength = 15;
export default class GameSession {
  constructor() {
    this.key = this.generateRandomGameKey(keyLength);
    this.players = [];
    this.clients = [];
    this.initialBoardConfiguration = {};
  }

  generateRandomGameKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  findPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }
}
