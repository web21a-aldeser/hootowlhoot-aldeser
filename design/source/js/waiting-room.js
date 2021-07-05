/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/**
 * Player/Rivals class
 */
class Player {
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

/**
 * Players list
 */
const PLAYER_AVATAR_POS = 0;
const PLAYER_NAME_POS = 1;
const ACCEPT_BUTTON_TEXT = 'Aceptar';
const NAME_MAX_LENGTH = '25';
const NAME_MIN_LENGTH = '2';
const INPUT_DISPLAY_SIZE = '10';
const NAME_REQUIRED = 'Name is required';
const DIV_FOR_INPUT_ID = 'input-with-button-for-name';
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
        const players = this.playersTable.rows;

        for (let index = 0; index < players.length; index += 1) {
            const row = players.item(index);
            const avatarHolder = document.getElementById(row.cells.item(PLAYER_AVATAR_POS).id);
            const dino = avatarHolder.children[0].children[0].src;
            const nameHolder = document.getElementById(row.cells.item(PLAYER_NAME_POS).id);
            const name = nameHolder.textContent;

            const player = new Player(row.cells.item(PLAYER_AVATAR_POS).id,
                row.cells.item(PLAYER_NAME_POS).id, name, dino, index);
            this.addPlayerToList(player);
        }
        // localStorage.setItem('players-lenght', JSON.stringify(this.players.length));
    }

    addPlayerToList(player) {
        this.players.push(player);
    }

    passListPlayers(players) {
        localStorage.clear();
        for (let i = 0; i < players.length; i += 1) {
            const items = [];
            items.push(players[i].name);
            items.push(players[i].avatar);
            localStorage.setItem(i, JSON.stringify(items));
        }
        localStorage.setItem('players-quantity', JSON.stringify(players.length));
    }

    setupEventsForPlayersList(avatarSelector) {
        for (let index = 0; index < this.players.length; index += 1) {
            this.players[index].avatarElement.addEventListener('click', () => {
                avatarSelector.show();
                avatarSelector.setPlayersAvatarId(this.players[index].avatarId);
                avatarSelector.setPlayerAvatar(this.players[index].avatarId, index);
            });
            // eslint-disable-next-line max-len
            this.setUpEventForPlayersNameElement(this.players[index].nameElement, this.players[index].name, index);
            this.passListPlayers(this.players);
        }
    }

    updateName(index, name) {
        const items = [];
        const lista = localStorage.getItem(index);
        const avatar = JSON.parse(lista);
        items.push(name);
        items.push(avatar[1]);
        localStorage.setItem(index, JSON.stringify(items));
    }

    setUpEventForPlayersNameElement(playersNameElement, name, index) {
        playersNameElement.addEventListener('click', () => {
            const parentElementOfPlayersNameElement = playersNameElement.parentElement;

            const containerForPlayersNameInputWithButton = document.createElement('div');
            containerForPlayersNameInputWithButton.id = DIV_FOR_INPUT_ID;

            const inputForPlayerName = document.createElement('input');
            inputForPlayerName.maxLength = NAME_MAX_LENGTH;
            inputForPlayerName.minLength = NAME_MIN_LENGTH;
            inputForPlayerName.size = INPUT_DISPLAY_SIZE;

            const inputConfirmationButton = document.createElement('button');
            inputConfirmationButton.innerHTML = ACCEPT_BUTTON_TEXT;
            containerForPlayersNameInputWithButton.appendChild(inputForPlayerName);
            containerForPlayersNameInputWithButton.appendChild(inputConfirmationButton);

            parentElementOfPlayersNameElement.replaceChild(containerForPlayersNameInputWithButton,
                playersNameElement);
            playersNameElement.style.display = 'none';
            inputConfirmationButton.addEventListener('click', () => {
                const input = inputForPlayerName.value;
                const inputIsEmpty = input === '';
                if (!inputIsEmpty) {
                    playersNameElement.innerHTML = input;
                    // name = input;
                    // actualizar localstorage
                    this.updateName(index, input);
                    this.players[index].name = input;
                    parentElementOfPlayersNameElement.replaceChild(playersNameElement,
                        containerForPlayersNameInputWithButton);
                    playersNameElement.style.display = 'block';
                } else {
                    inputForPlayerName.placeholder = NAME_REQUIRED;
                    inputForPlayerName.classList.add('input-error', 'text-error');
                }
            });
        });
    }
}

/**
 * Avatar selector class
 */
const AVATAR_SELECTION_ID = 'avatar-selection';
const AVATAR_SELECTION_TABLE_ID = 'avatar-selection-table';
const AVATAR_IMAGE_CELL = 1;
const AVATAR_IMAGE_POS = 0;
const AVATAR_BUTTON_CELL = 0;
const AVATAR_SELECTION_BUTTON = 0;
const PLAYERS_AVATAR_CELL = 0;
const PLAYERS_AVATAR_BUTTON = 0;

class AvatarSelector {
    constructor(playersList) {
        this.element = document.getElementById(AVATAR_SELECTION_ID);
        this.element.style.display = 'none';
        this.avatarsTable = document.getElementById(AVATAR_SELECTION_TABLE_ID);
        this.playersList = playersList;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    /**
     * Avatar id is necessary to change player's avatar.
     *
     * @param id - The player's avatar id.
     */
    setPlayersAvatarId(id) {
        this.element.dataset.avatarId = id;
    }

    setPlayerAvatar(id, index) {
        const temp = document.getElementById(id);
        this.element.dataset.avatar = temp.children[0].children[0].src;
        this.element.dataset.key = index;
    }

    configure() {
        this.setupEvents();
    }

    updateAvatar(index, avatar) {
        const items = [];
        const lista = localStorage.getItem(index);
        const name = JSON.parse(lista);
        items.push(name[0]);
        items.push(avatar);
        localStorage.setItem(index, JSON.stringify(items));
    }

    setupEvents() {
        const avatars = this.avatarsTable.rows;
        for (let index = 0; index < avatars.length; index += 1) {
            const avatarSelectionButton = avatars[index]
                .children[AVATAR_BUTTON_CELL]
                .children.item(AVATAR_SELECTION_BUTTON);

            const avatarImagePath = avatars[index]
                .children[AVATAR_IMAGE_CELL]
                .children.item(AVATAR_IMAGE_POS).src;


            // eslint-disable-next-line no-loop-func
            avatarSelectionButton.addEventListener('click', () => {
                document.getElementById(this.element.dataset.avatarId)
                    .children[PLAYERS_AVATAR_CELL]
                    .children[PLAYERS_AVATAR_BUTTON].src = avatarImagePath;
                this.updateAvatar(this.element.dataset.key, avatarImagePath);
                // this.playersList[this.element.dataset.key].avatar = avatarImagePath;
            });
        }
    }
}

const PLAYER_TABLE_ID = 'players-list-table';

/**
 * Waiting room class
 */
class WaitingRoom {
    constructor() {
        this.playerList = new PlayerList(PLAYER_TABLE_ID);
        this.avatarSelector = new AvatarSelector(this.playersList);
        this.slider1 = document.getElementById('geyser-probability');
    }

    sliders() {
        const output1 = document.getElementById('geyser');
        output1.innerHTML = this.slider1.value;
        this.slider1.oninput = function() {
            output1.innerHTML = this.value;
        };
        const slider2 = document.getElementById('eggs-probability');
        const output2 = document.getElementById('eggs');
        output2.innerHTML = slider2.value;
        slider2.oninput = function() {
            output2.innerHTML = this.value;
        };

        const slider3 = document.getElementById('binoculars-probability');
        const output3 = document.getElementById('binoculars');
        output3.innerHTML = slider3.value;
        slider3.oninput = function() {
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

function main() {
    const waitingRoom = new WaitingRoom();
    waitingRoom.configure();
}

window.addEventListener('load', main);
