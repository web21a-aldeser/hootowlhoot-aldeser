import {PLAYERS_CARDS_TABLE_ID, BOTTOM, Player} from './Player.js';
import messagesTypes from '../waiting-room/MessagesTypes.js';

const CARDS_CELL = 2;
const CARDS_COUNT = 3;

const CARDS = [
  'icons/cards/blue.svg',
  'icons/cards/yellow.svg',
  'icons/cards/red.svg',
  'icons/cards/green.svg',
  'icons/cards/orange.svg',
  'icons/cards/purple.svg',
  'icons/cards/meteorite.svg'
];

export default class Game {
  constructor(websocket) {
    this.tableBodyElement = document.getElementById(PLAYERS_CARDS_TABLE_ID);
    // The order of players must be the same on the players table.
    this.playerList = [];
    this.geyserList = [];
    this.eggList = [];
    this.binoList = [];
    this.turn = document.getElementById('turn');
    this.meteor = document.getElementById('meteor');
    this.currentList = [];
    this.currentPlayer = 0;
    this.boardData = {
      type: 'createBoard',
      value: {
        session_key: '',
        tiles: {}
      }
    };
    this.numberElements = 0;
    this.websocket = websocket;
  }

  configurePlayersCards(id) {
    this.createPlayersAndGenerateRandomIntialCardHandForEachOne();
    localStorage.setItem('players-arena', JSON.stringify(this.playerList));
    this.setFirstTurn();
    if (id == 1) {
      this.createGeyser();
      this.createEggs();
      this.createBino();
    }
    const pass = document.getElementById('pass');
    pass.addEventListener('click', () => {
      this.changeTurn(this.currentPlayer);
      this.sendTurnUpdateToServer(this.currentPlayer);
    });
    this.setupEventsForCards();
  }
  /************************** OBJECTS ACTIONS ********************************/

  showGeysers() {
    this.currentList = [];
    for (let i = 0; i < this.geyserList.length; i += 1) {
      if (this.geyserList[i].style.display === 'none') {
        this.geyserList[i].style.display = 'block';
        this.currentList.push(this.geyserList[i]);
      }
    }
  }

   //egg method. duplicates turn
   eggAction(index){
    this.playerList[index].currentCell.children[0].style.display = 'block';
    if (this.currentPlayer === 0){
      this.currentPlayer = this.playerList.length -1;
    } else {
      this.currentPlayer -=1;
    }
    const audio2 = new Audio('sounds/achivement.wav');
    audio2.play();  
  }


  // evalua el objeto en el que el jugador cae para ejecutar su determinada accion
  objectActions(src, card, index) {
    switch (true) {
      // caso de binoculares, permite ver geysers por un tiempo determinado
      case src.indexOf('see') !== -1:
        this.playerList[index].currentCell.children[0].style.display = 'block';
        // this.player.previusCell = this.player.currentCell;
        this.showGeysers();
        const list = this.currentList;
        setTimeout(() => {
          for (let i = 0; i < list.length; i += 1) {
            list[i].style.display = 'none';
          }
        }, 10000);
        const audio1 = new Audio('sounds/achivement.wav');
        audio1.play();
        break;

      // caso de huevos, duplican turno
      case src.indexOf('egg') !== -1:
        this.eggAction(index);
        break;

      // caso de geyser, el jugador vuelve a su posicion inicial
      // si escoge un color que ya tenia un geyser descubierto lo salta al siguiente color
      case src.indexOf('geyser') !== -1:
        // caso de que el geyser ya este descubierto en el color al que escogio
        if (this.playerList[index].currentCell.children[0].style.display === 'block') {
          let color = this.playerList[index].currentCell.className;
          do {
            this.playerList[index].move();
            color = this.playerList[index].currentCell.className;
          } while (card.src.indexOf(color) === -1);
        } else {
          const geyser = this.playerList[index].currentCell.children[0];
          geyser.style.display = 'block';
          geyser.style.filter = 'brightness(1.75)';
          this.playerList[index].avatar.style.filter = 'brightness(0)';
          setTimeout(() => {
            geyser.style.filter = 'brightness(1)';
            this.playerList[index].avatar.style.filter = 'brightness(1)';
          }, 1000);
          this.playerList[index].currentCell.removeChild(this.playerList[index].avatar);
          this.playerList[index].currentCell = this.playerList[index].previusCell;
          this.playerList[index].previusCell.appendChild(this.playerList[index].avatar);
          this.playerList[index].row = this.playerList[index].prevRow;
          this.playerList[index].colum = this.playerList[index].prevCol;
          // unvalidate cell
          const audio3 = new Audio('sounds/explosion.wav');
          audio3.play();
        }
        break;

      default:
        break;
    }
  }

  // desactiva las cartas de los jugadores a los que no les corresponde el turno
  disableCards() {
    const playersCount = this.tableBodyElement.children.length;
    for (let i = 0; i < playersCount; i += 1) {
      const playersCards = this.tableBodyElement.children.item(i).children.item(CARDS_CELL);
      for (let j = 0; j < CARDS_COUNT; j += 1) {
        playersCards.children[j].disabled = true;
        playersCards.children[j].style.opacity = '0.5';
        if (this.currentPlayer === i) {
          playersCards.children[j].disabled = false;
          playersCards.children[j].style.opacity = '1';
        }
      }
    }
  }

  //desactiva las cartas si se encuentra 1 de meteorito
  searchMeteorite(index) {
    const playersCards = this.tableBodyElement.children.item(index).children.item(CARDS_CELL);
    let found = false;
    for (let j = 0; j < CARDS_COUNT; j += 1) {
      if (playersCards.children[j].src.indexOf('meteorite') !== -1) {
        found = true;
        console.log('found');
      }
    }
    if (found) {
      for (let j = 0; j < CARDS_COUNT; j += 1) {
        playersCards.children[j].disabled = true;
        playersCards.children[j].style.opacity = '0.5';
        if (playersCards.children[j].src.indexOf('meteorite') !== -1) {
          playersCards.children[j].disabled = false;
          playersCards.children[j].style.opacity = '1';
        }
      }
    }
  }

  setupEventsForCards() {
    const playersCount = this.tableBodyElement.children.length;

    // For each player on the players table.
    for (let playerIndex = 0; playerIndex < playersCount; playerIndex += 1) {
      const playerCards = this.tableBodyElement.children
        .item(playerIndex)
        .children.item(CARDS_CELL);

      // For each card of the player.
      for (let cardIndex = 0; cardIndex < CARDS_COUNT; cardIndex += 1) {
        // It gets the i-th card of the current player.
        const card = playerCards.children[cardIndex];
        // It configures on click event for current card.
        card.addEventListener('click', () => {
          // Event for meteorite card.
          if (card.src.indexOf('meteorite') !== -1) {
            this.moveMeteorite();
            this.sendMeteoriteMovementToServer();
          } else {
            // Event for normal card.
            let cardColor = this.playerList[playerIndex].currentCell.className;
            this.playerList[playerIndex].previusCell = this.playerList[playerIndex].currentCell;

            // It moves the player until it finds the target color.
            do {
              this.playerList[playerIndex].move();
              cardColor = this.playerList[playerIndex].currentCell.className;
            } while (card.src.indexOf(cardColor) === -1);

            // If an object is found e.g egg, binoculars.. It performs the event.
            // Otherwise, it just moves the player.
            const objectFoundInNewPlayersPosition =
              this.playerList[playerIndex].currentCell.children[0].src != null;

            if (objectFoundInNewPlayersPosition) {
              // Execute action associated with event.
              this.objectActions(
                this.playerList[playerIndex].currentCell.children[0].src,
                card,
                playerIndex
              );
            } else {
              // Move player.
              this.playerList[playerIndex].previusCell = this.playerList[playerIndex].currentCell;
            }

            this.playerList[playerIndex].prevCol = this.playerList[playerIndex].colum;
            this.playerList[playerIndex].prevRow = this.playerList[playerIndex].row;
            this.sendMovementMessage(playerIndex, cardColor, cardIndex);
          }

          // After the card was clicked and the actions such as show objects with binoculars executed.
          this.changeTurn(this.currentPlayer);
          this.sendTurnUpdateToServer(this.currentPlayer);

          this.sendCheckWin(this.checkWin());

          this.generateNewCardAndSyncPlayersList(playerIndex, cardIndex);
          this.sendCardsUpdateToServer(playerIndex);
        });
      }
    }
  }

  // checks if all the players are in the final cell
  checkWin(){
    const finalCell = document.getElementById('final').childElementCount;
    if (finalCell === JSON.parse(localStorage.getItem('players-quantity')) + 1) {
      const audio = new Audio('sounds/levelComplete.wav');
      audio.play();
      return true;
    }
    return false;
  }
  
  //sends the message for checking if all the players are in the final cell
  sendCheckWin(check) {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));
  
    const message = {
      type: messagesTypes.checkWin,
      value: {
        session_key: playerIdentity.session_key,
        player_id: playerIdentity.player_id,
        win: check
      }
    };
    this.websocket.send(JSON.stringify(message));
    if (check){
      window.location.href = 'aftermatch';
    }
  }
  
  receiveCheckWin(check){
    if (check) {
      window.location.href = 'aftermatch';
    }
  }
  

  /************************** CARDS RELATED METHODS BEGIN ********************************/
  generateNewCardAndSyncPlayersList(playerIndex, cardIndex) {
    // It gets the cards for the player with the provided index.
    const playerCards = this.tableBodyElement.children.item(playerIndex).children.item(CARDS_CELL);

    console.log(this.playerList);
    const card = playerCards.children[cardIndex];
    card.src = this.getRandomCard();

    // It updates the card avatar for the provided player index on players list.
    this.playerList[playerIndex].cards[cardIndex] = card.src;
  }

  // Client receiving side.
  // It updates cards with the received message
  receiveCardsUpdateFromServer(message) {
    console.log(message, 'recibiendo');

    const playersCards = this.tableBodyElement.children
      .item(message.value.player_position_in_table)
      .children.item(CARDS_CELL);

    // It updates the color for each card in the hand.
    for (let cardIndex = 0; cardIndex < message.value.colors.length; cardIndex++) {
      const card = playersCards.children[cardIndex];
      console.log('carta');
      card.src = message.value.colors[cardIndex];
      this.playerList[message.value.player_position_in_table].cards[cardIndex] = card.src;
    }
  }

  // Client sending side.
  // send a message with the colors of the cards
  sendCardsUpdateToServer(playerIndex) {
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    const cards = {
      type: messagesTypes.cardSync,
      value: {
        session_key: playerIdentity.session_key,
        player_id: playerIdentity.player_id,
        colors: this.playerList[playerIndex].cards,
        player_position_in_table: playerIndex
      }
    };
    console.log(cards);
    this.websocket.send(JSON.stringify(cards));
  }
  /************************** CARDS RELATED METHODS END ********************************/

  //-------------------------------------------------------------------------------------

  /************************** TURN RELATED METHODS BEGIN ********************************/
  setFirstTurn() {
    this.turn.innerText = this.playerList[0].name;
    this.disableCards();
    this.searchMeteorite(this.currentPlayer);
  }

  // It changes the player turn.
  changeTurn(index) {
    if (index < this.playerList.length - 1) {
      index += 1;
    } else {
      index = 0;
    }
    this.changeTurnOnUi(index);
    // Is the necessary?
    localStorage.setItem('players-arena', JSON.stringify(this.playerList));
  }

  // Turn receiving side.
  receiveTurnUpdate(playerIndex) {
    this.changeTurnOnUi(playerIndex);
  }

  changeTurnOnUi(index) {
    this.turn = document.getElementById('turn');
    this.turn.innerText = this.playerList[index].name;
    this.currentPlayer = index;
    this.disableCards();
    this.searchMeteorite(this.currentPlayer);
  }

  // Turn sending side.
  sendTurnUpdateToServer(index) {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    const getTurnMessage = {
      type: messagesTypes.currentTurn,
      value: {
        session_key: playerIdentity.session_key,
        player_id: playerIdentity.player_id,
        player_index: index
      }
    };
    console.log(JSON.stringify(getTurnMessage));
    this.websocket.send(JSON.stringify(getTurnMessage));
  }
  /************************** TURN RELATED METHODS END ********************************/

  //mueve el meteorito cada vez que sale una carta
  moveMeteorite() {
    const proximity = document.getElementById('clarity');
    const elements = proximity.children;

    let index;
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].children.length === 1) {
        index = i;
      }
    }
    if (index !== elements.length - 1) {
      elements[index].removeChild(this.meteor);
      elements[index + 1].appendChild(this.meteor);
      const audio1 = new Audio('sounds/meteor.wav');
      audio1.play();
    } else {
      this.meteor.style.position = 'absolute';
      this.meteor.style.left = '850px';
      this.meteor.style.top = '100px';
      this.sendLoseCheck();
      window.location.href = 'aftermatch';
    }
  }

  sendLoseCheck() {
    const sessionKey = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity)).session_key;
    const checkLose = {
      type: messagesTypes.checkLose,
      value: {
        session_key: sessionKey,
        data: []
      }
    };
    this.websocket.send(JSON.stringify(checkLose));
  }

  // Sending side.
  sendMeteoriteMovementToServer() {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    const meteoriteMovementMessage = {
      type: messagesTypes.meteoriteMovement,
      value: {
        session_key: playerIdentity.session_key,
        player_id: playerIdentity.player_id
      }
    };

    this.websocket.send(JSON.stringify(meteoriteMovementMessage));
  }

  // Moves the player specified in the message
  // to the closer space of the specifed color in the message
  movePlayer(message) {
    let colorToGo = message.value.color;
    let playerIndex = parseInt(JSON.stringify(message.value.playerIndex));

    const playersCards = this.tableBodyElement.children.item(playerIndex).children.item(CARDS_CELL);
    const card = playersCards.children[message.value.cardIndex];
    let color = this.playerList[playerIndex].currentCell.className;

    this.playerList[playerIndex].previousCell = this.playerList[playerIndex].currentCell;
    // It moves the player until it finds the target color.
    do {
      this.playerList[playerIndex].move();
      color = this.playerList[playerIndex].currentCell.className;
      console.log(color + ' ' + colorToGo);
    } while (colorToGo !== color);

    // si encuentra un objeto en la celda actual realiza su evento si no solo se mueve
    if (this.playerList[playerIndex].currentCell.children[0].src != null) {
      this.objectActions(
        this.playerList[playerIndex].currentCell.children[0].src,
        card,
        playerIndex
      );
    } else {
      this.playerList[playerIndex].previusCell = this.playerList[playerIndex].currentCell;
    }
    this.playerList[playerIndex].prevCol = this.playerList[playerIndex].colum;
    this.playerList[playerIndex].prevRow = this.playerList[playerIndex].row;
  }

  // Sending side.
  sendMovementMessage(playerIndex, color, cardIndex) {
    // Player identity reference { player_id: message.player_id, session_key: message.session_key }
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));

    const playerMovementMessage = {
      type: messagesTypes.movementInfo,
      value: {
        session_key: playerIdentity.session_key,
        playerIndex: playerIndex,
        color: color,
        cardIndex: cardIndex
      }
    };
    console.log(JSON.stringify(playerMovementMessage));
    this.websocket.send(JSON.stringify(playerMovementMessage));
  }

  // retorna una carta al azar
  // eslint-disable-next-line class-methods-use-this
  getRandomCard() {
    return CARDS[Math.floor(Math.random() * CARDS.length)];
  }

  // pasa la lista de jugadores
  createPlayersAndGenerateRandomIntialCardHandForEachOne() {
    // It gets players data generated on waiting room.
    const localList = JSON.parse(localStorage.getItem('players'));

    // crea y configura los jugadores
    for (let playerIndex = 0; playerIndex < localList.length; playerIndex += 1) {
      const player = new Player(
        localList[playerIndex].name,
        localList[playerIndex].avatar,
        playerIndex
      );
      player.configurePlayer();
      this.playerList.push(player);

      const playerCards = this.tableBodyElement.children
        .item(playerIndex)
        .children.item(CARDS_CELL);
      // Asigna cartas al azar.
      for (let cardIndex = 0; cardIndex < CARDS_COUNT; cardIndex += 1) {
        const card = playerCards.children[cardIndex];
        card.src = this.getRandomCard();
        this.playerList[playerIndex].cards[cardIndex] = card.src;
      }
      this.sendCardsUpdateToServer(playerIndex);
    }
    console.log(this.playerList);
  }

  // asigns a random cell to new objects
  // eslint-disable-next-line class-methods-use-this
  randomCell(newElement) {
    // array with the number of valid columns in the board
    // the columns change in concern of the rows
    const validCol = [0, 2, 4, 6];
    let col = 0;
    const row = Math.floor(Math.random() * 8);
    if (row === 0) {
      validCol.push(3);
      validCol.push(7);
      // dependiendo de la cantidad de jugadores este valor cambia
      // ya que los jugadores se posicionan en las primeras casillas
      col = validCol[Math.floor(Math.random() * 6) + 1];
      while (col === undefined) {
        col = validCol[Math.floor(Math.random() * 6) + 1];
      }
    } else if (row === 7) {
      validCol.push(1);
      validCol.push(5);
      col = validCol[Math.floor(Math.random() * 6)];
    } else {
      col = validCol[Math.floor(Math.random() * 4)];
    }
    this.boardData.value.tiles[this.numberElements] = {
      position: row.toString() + col.toString(),
      element: newElement.toString()
    };
    ++this.numberElements;
    return document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
  }

  createGeyser() {
    const geyserTotal = JSON.parse(localStorage.getItem('Geysers'));
    for (let i = 0; i < geyserTotal; i += 1) {
      // create geysers
      const mine = document.createElement('img');
      mine.src = 'icons/geyser.svg';
      mine.width = '60';
      mine.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell(1);
      while (newCell.children.length !== 0) {
        newCell = this.randomCell(1);
      }
      newCell.appendChild(mine);
      const computedStyles = window.getComputedStyle(mine);
      mine.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
      mine.style.left = `${parseInt(computedStyles.left, 10) + 20}px`;
      mine.style.display = 'none';
      this.geyserList.push(mine);
    }
  }

  createEggs() {
    const eggsTotal = JSON.parse(localStorage.getItem('Eggs'));

    for (let i = 0; i < eggsTotal; i += 1) {
      // create egg
      const egg = document.createElement('img');
      egg.src = 'icons/egg.svg';
      egg.width = '50';
      egg.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell(3);
      while (newCell.children.length !== 0) {
        newCell = this.randomCell(3);
      }
      newCell.appendChild(egg);
      const computedStyles = window.getComputedStyle(egg);
      egg.style.top = `${parseInt(computedStyles.top, 10) - 20}px`;
      egg.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
      egg.style.display = 'none';
      this.eggList.push(egg);
    }
  }

  createBino() {
    const binoTotal = JSON.parse(localStorage.getItem('Binoculars'));

    for (let i = 0; i < binoTotal; i += 1) {
      // create Binoculars
      const bino = document.createElement('img');
      bino.src = 'icons/see.svg';
      bino.width = '50';
      bino.style.position = 'absolute';
      // Asign positions
      let newCell = this.randomCell(2);
      while (newCell.children.length !== 0) {
        newCell = this.randomCell(2);
      }
      newCell.appendChild(bino);
      const computedStyles = window.getComputedStyle(bino);
      bino.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
      bino.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
      bino.style.display = 'none';
      this.binoList.push(bino);
    }
  }

  //Given a tile in a position(x,y in format 'xy'),
  //adds the corresponding custom elements to that tile.
  //The possible custom elements are an int that represents the element:
  //1: adds a geyser, 2: adds binoculars, 3: adds and egg
  AddTileElements(position, customElements) {
    let newCell = document.querySelector(
      `td[data-row="${parseInt(position.substr(0, 1))}"][data-col="${parseInt(
        position.substr(1, 2)
      )}"]`
    );
    let computedStyles;

    // We should use constants or enums instead of integers (case 1).
    switch (parseInt(customElements)) {
      //Add geyser
      case 1:
        const mine = document.createElement('img');
        mine.src = 'icons/geyser.svg';
        mine.width = '60';
        mine.style.position = 'absolute';

        newCell.appendChild(mine);
        computedStyles = window.getComputedStyle(mine);
        mine.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
        mine.style.left = `${parseInt(computedStyles.left, 10) + 20}px`;
        mine.style.display = 'none';
        this.geyserList.push(mine);
        break;
      //Add binocular
      case 2:
        const bino = document.createElement('img');
        bino.src = 'icons/see.svg';
        bino.width = '50';
        bino.style.position = 'absolute';

        newCell.appendChild(bino);
        computedStyles = window.getComputedStyle(bino);
        bino.style.top = `${parseInt(computedStyles.top, 10) - 25}px`;
        bino.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
        bino.style.display = 'none';
        this.binoList.push(bino);
        break;
      //Add egg
      case 3:
        const egg = document.createElement('img');
        egg.src = 'icons/egg.svg';
        egg.width = '50';
        egg.style.position = 'absolute';

        newCell.appendChild(egg);
        computedStyles = window.getComputedStyle(egg);
        egg.style.top = `${parseInt(computedStyles.top, 10) - 20}px`;
        egg.style.left = `${parseInt(computedStyles.left, 10) + 22}px`;
        egg.style.display = 'none';
        this.eggList.push(egg);
        break;
    }
  }

  // Puts the custom elements(geysers, binoculars and eggs) in the
  // corresponding tiles of the arena acording to the message recieved.
  createArena(message) {
    this.boardData = message;
    for (let tile in message.value.tiles) {
      if (message.value.tiles.hasOwnProperty(tile)) {
        this.AddTileElements(message.value.tiles[tile].position, message.value.tiles[tile].element);
      }
    }
    console.log(message);
  }

  // Sends a a message containig the board data in order for the board
  // to be replicated for other users.
  sendCreationEventToServer() {
    const playerIdentity = JSON.parse(localStorage.getItem(messagesTypes.playerIdentity));
    this.boardData.value.session_key = playerIdentity.session_key;
    console.log(JSON.stringify(this.boardData));
    this.websocket.send(JSON.stringify(this.boardData));
  }
}
