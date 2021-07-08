import Game from './Game.js';

function main() {
    const game = new Game();
    game.configurePlayersCards();
}

window.addEventListener('load', main);
