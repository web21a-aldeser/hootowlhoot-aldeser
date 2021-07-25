/* eslint-disable class-methods-use-this */
import Player from './Player.js';
import messagesTypes from './MessagesTypes.js';

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
    this.websocket = null;
  }

  configurePlayersList(avatarSelector) {
    this.retrieveDataFromPlayersTable();
    this.setupEventsForPlayersList(avatarSelector);
  }

  retrieveDataFromPlayersTable() {
    this.players = [];
    const players = this.playersTable.rows;

    for (let index = 0; index < players.length; index += 1) {
      const row = players.item(index);
      const avatarHolder = document.getElementById(row.cells.item(PLAYER_AVATAR_POS).id);
      const dino = avatarHolder.children[0].children[0].src;
      const nameHolder = document.getElementById(row.cells.item(PLAYER_NAME_POS).id);
      const name = nameHolder.textContent;

      const player = new Player(
        row.cells.item(PLAYER_AVATAR_POS).id,
        row.cells.item(PLAYER_NAME_POS).id,
        name,
        dino,
        index,
        parseInt(row.id)
      );
      this.players.push(player);
    }
    // localStorage.setItem('players-lenght', JSON.stringify(this.players.length));
  }

  getPlayers() {
    return this.players;
  }

  updateName(index, name) {
    this.players[index].name = name;
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  refreshStorage() {
    this.passListPlayers();
  }

  passListPlayers() {
    //localStorage.clear();
    localStorage.setItem('players', JSON.stringify(this.players));
    localStorage.setItem('players-quantity', JSON.stringify(this.players.length));
  }

  setupEventsForPlayersList(avatarSelector) {
    for (let index = 0; index < this.players.length; index += 1) {
      this.players[index].avatarElement.addEventListener('click', () => {
        avatarSelector.show();
        avatarSelector.setPlayersAvatarId(this.players[index].avatarId);
        avatarSelector.setPlayerAvatar(this.players[index].avatarId, index);
      });
      // eslint-disable-next-line max-len
      this.setUpEventForPlayersNameElement(
        this.players[index].nameElement,
        this.players[index].name,
        index
      );
      this.passListPlayers();
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

      parentElementOfPlayersNameElement.replaceChild(
        containerForPlayersNameInputWithButton,
        playersNameElement
      );
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
          parentElementOfPlayersNameElement.replaceChild(
            playersNameElement,
            containerForPlayersNameInputWithButton
          );
          playersNameElement.style.display = 'block';
          this.sendPlayerNameUpdateToServer(input);
        } else {
          inputForPlayerName.placeholder = NAME_REQUIRED;
          inputForPlayerName.classList.add('input-error', 'text-error');
        }
      });
    });
  }

  sendPlayerNameUpdateToServer(playerName) {
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    const playerNameUpdate = {
      type: messagesTypes.playerNameUpdate,
      value: {
        player_id: playerIdentity.player_id,
        session_key: playerIdentity.session_key,
        player_name: playerName
      }
    };
    this.websocket.send(JSON.stringify(playerNameUpdate));
  }
}
