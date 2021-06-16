class Geyser {
    constructor(pos) {
        this.estado;
        this.pos = pos;
        this.visibility;
        this.source = 'icons/geyser.svg';
    }
}
const objects = {
    geyser: 'icons/geyser.svg',
    egg: 'icons/egg.svg',
    binocular: 'icons/binoculars.svg',

}
const GEYSERLIST = [];
const CELLS = 36;

function createGeyser() {
    let num = parseInt(localStorage.getItem('Geyser'));
    const geyserTotal = (num * CELLS) / 100;

    for (let i = 0; i < geyserTotal; i++) {
        let mine = document.createElement("img");
        mine.src = 'icons/geyser.svg';

    }
}