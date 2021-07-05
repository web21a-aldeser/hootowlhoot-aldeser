export default class AvatarSelector {
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
                console.log(this.element.dataset.key);
                updateAvatar(this.element.dataset.key, avatarImagePath);
                // this.playersList[this.element.dataset.key].avatar = avatarImagePath;
            });
        }
    }

    updateAvatar(index, avatar) {
        let items = [];
        let lista = localStorage.getItem(index);
        let name = JSON.parse(lista);
        items.push(name[0]);
        items.push(avatar);
        localStorage.setItem(index, JSON.stringify(items));
    }
}