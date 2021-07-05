/* eslint-disable class-methods-use-this */
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
export default class PlayerList {
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

    updateName(index, name) {
        const items = [];
        const lista = localStorage.getItem(index);
        const avatar = JSON.parse(lista);
        items.push(name);
        items.push(avatar[1]);
        localStorage.setItem(index, JSON.stringify(items));
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
