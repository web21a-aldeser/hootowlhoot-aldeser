import PlayerList from './PlayerList.js';
import AvatarSelector from './AvatarSelector.js';
import messagesTypes from './MessagesTypes.js';

const PLAYER_TABLE_ID = 'players-list-table';
const waitingTimeToChangeScreen = 3000;

export default class WaitingRoom {
  constructor(websocket) {
    this.websocket = websocket;
    this.playerList = new PlayerList(PLAYER_TABLE_ID);
    this.playerList.websocket = websocket;
    this.avatarSelector = new AvatarSelector();
    this.avatarSelector.websocket = websocket;
  }

  // eslint-disable-next-line class-methods-use-this
  sliders() {
    const slider1 = document.getElementById('geyser-probability');
    const output1 = document.getElementById('geyser');
    output1.innerHTML = slider1.value;
    slider1.oninput = () => {
      output1.innerHTML = slider1.value;
    };
    const slider2 = document.getElementById('eggs-probability');
    const output2 = document.getElementById('eggs');
    output2.innerHTML = slider2.value;
    slider2.oninput = () => {
      output2.innerHTML = slider2.value;
    };

    const slider3 = document.getElementById('binoculars-probability');
    const output3 = document.getElementById('binoculars');
    output3.innerHTML = slider3.value;
    slider3.oninput = () => {
      output3.innerHTML = slider3.value;
    };
  }

  configure() {
    this.sliders();
    this.avatarSelector.configure();
    this.playerList.configurePlayersList(this.avatarSelector);
    const options = [];

    // When the match is starting it saves the configuration of the settings
    document.getElementById('start-match-button').addEventListener('click', () => {
      options.push(document.getElementById('geyser-probability').value);
      options.push(document.getElementById('eggs-probability').value);
      options.push(document.getElementById('binoculars-probability').value);
      localStorage.setItem('Geysers', JSON.stringify(options[0]));
      localStorage.setItem('Eggs', JSON.stringify(options[1]));
      localStorage.setItem('Binoculars', JSON.stringify(options[2]));

      this.sendMatchStartedMessageToServer();
      window.location.href = 'arena.xhtml';
    });
  }

  sendMatchStartedMessageToServer() {
    const sessionKey = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity)).session_key;
    const matchStarted = {
      type: messagesTypes.matchStarted,
      value: {
        session_key: sessionKey,
        data: []
      }
    };
    this.websocket.send(JSON.stringify(matchStarted));
  }

  updatePlayerName(message) {
    const player = this.playerList.players.find((p) => p.playerIdForSession === message.player_id);
    player.updateName(message.player_name);
    this.playerList.refreshStorage();
  }

  updatePlayerAvatar(message) {
    const player = this.playerList.players.find((p) => p.playerIdForSession === message.player_id);
    player.updateAvatar(message.avatar_path);
    this.playerList.refreshStorage();
  }
}
