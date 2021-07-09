import PlayerList from './PlayerList.js';
import AvatarSelector from './AvatarSelector.js';

const PLAYER_TABLE_ID = 'players-list-table';

export default class WaitingRoom {
    constructor() {
        this.playerList = new PlayerList(PLAYER_TABLE_ID);
        this.avatarSelector = new AvatarSelector(this.playersList);
        this.slider1 = document.getElementById('geyser-probability');
    }

    sliders() {
        const output1 = document.getElementById('geyser');
        output1.innerHTML = this.slider1.value;
        this.slider1.oninput = () => {
            output1.innerHTML = this.value;
        };
        const slider2 = document.getElementById('eggs-probability');
        const output2 = document.getElementById('eggs');
        output2.innerHTML = slider2.value;
        slider2.oninput = () => {
            output2.innerHTML = this.value;
        };

        const slider3 = document.getElementById('binoculars-probability');
        const output3 = document.getElementById('binoculars');
        output3.innerHTML = slider3.value;
        slider3.oninput = () => {
            output3.innerHTML = this.value;
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
            window.location = 'arena.xhtml';
        });
    }
}
