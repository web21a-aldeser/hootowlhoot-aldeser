/**
 * Player class
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
        console.log("retrive data")

        for (let index = 0; index < players.length; index += 1) {
            const row = players.item(index);
            let avatarHolder = document.getElementById(row.cells.item(PLAYER_AVATAR_POS).id);
            let dino = avatarHolder.children[0].children[0].src;
            let nameHolder = document.getElementById(row.cells.item(PLAYER_NAME_POS).id);
            let name = nameHolder.textContent;

            const player = new Player(row.cells.item(PLAYER_AVATAR_POS).id,
                row.cells.item(PLAYER_NAME_POS).id, name, dino, index);
            this.addPlayerToList(player);
        }
        for (let i = 0; i < this.players.length; i++) {
            console.log(this.players[i]);
        }
    }

    addPlayerToList(player) {
        this.players.push(player);
    }

    setupEventsForPlayersList(avatarSelector) {
        for (let index = 0; index < this.players.length; index += 1) {
            this.players[index].avatarElement.addEventListener('click', () => {
                avatarSelector.show();
                avatarSelector.setPlayersAvatarId(this.players[index].avatarId);
                avatarSelector.setPlayerAvatar(this.players[index].avatarId, index);
            });
            this.setUpEventForPlayersNameElement(this.players[index].nameElement, this.players[index].name, index);
            passListPlayers(this.players)
        }
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
                    name = input;
                    //actualizar localstorage
                    updateName(index, name);
                    this.players[index].name = name;
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
        let temp = document.getElementById(id);
        this.element.dataset.avatar = temp.children[0].children[0].src;
        this.element.dataset.key = index;
    }

    configure() {
        this.setupEvents();
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


            avatarSelectionButton.addEventListener('click', () => {
                document.getElementById(this.element.dataset.avatarId)
                    .children[PLAYERS_AVATAR_CELL]
                    .children[PLAYERS_AVATAR_BUTTON].src = avatarImagePath;
                console.log("boton de dinos");
                console.log(this.element.dataset.key);
                updateAvatar(this.element.dataset.key, avatarImagePath);
                //this.playersList[this.element.dataset.key].avatar = avatarImagePath;
            });
        }
    }
}


function passListPlayers(players) {
    localStorage.clear();
    for (let i = 0; i < players.length; i++) {
        let items = [];
        items.push(players[i].name);
        items.push(players[i].avatar);
        localStorage.setItem(i, JSON.stringify(items));
    }
}
/**
 *Local Storage functions
 */
function updateName(index, name) {
    let items = [];
    let lista = localStorage.getItem(index);
    let avatar = JSON.parse(lista);
    items.push(name);
    items.push(avatar[1]);
    localStorage.setItem(index, JSON.stringify(items));

}

function updateAvatar(index, avatar) {
    let items = [];
    let lista = localStorage.getItem(index);
    let name = JSON.parse(lista);
    items.push(name[0]);
    items.push(avatar);
    localStorage.setItem(index, JSON.stringify(items));

}
const PLAYER_TABLE_ID = 'players-list-table';

/**
 * Waiting room class
 */
class WaitingRoom {
    constructor() {
        this.playerList = new PlayerList(PLAYER_TABLE_ID);
        this.avatarSelector = new AvatarSelector(this.playersList);
    }

    configure() {
        this.avatarSelector.configure();
        this.playerList.configurePlayersList(this.avatarSelector);

    }


}

function main() {
    const waitingRoom = new WaitingRoom();
    waitingRoom.configure();

}

window.addEventListener('load', main);