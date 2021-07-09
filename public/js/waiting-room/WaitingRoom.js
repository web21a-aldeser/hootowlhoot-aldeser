import PlayerList from './PlayerList.js';
import AvatarSelector from './AvatarSelector.js';

const PLAYER_TABLE_ID = 'players-list-table';

export default class WaitingRoom {

  constructor(socket) {
    this.socket = socket;
    this.playerList = new PlayerList(PLAYER_TABLE_ID);
    this.avatarSelector = new AvatarSelector(this.playersList);
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

      const geyser_probability = document.getElementById('geyser-probability').value;
      const eggs_probability = document.getElementById('eggs-probability').value;
      const binoculars_probability = document.getElementById('binoculars-probability').value;

      const data = {
        "type": "arena_data",
        "value": {
          "game_settings": {
            "binoculars_probability": binoculars_probability,
            "eggs_probability": eggs_probability,
            "geyser_probability": geyser_probability
          },
          "players_list": [
          ]
        }
      };

      const players = this.playerList.getPlayers();
      players.forEach(player => {
        console.log(player);
        data.value.players_list.push(player.toJson());
      });

      this.socket.send(JSON.stringify(data));
      window.location = 'arena.xhtml';
    });
  }
}
