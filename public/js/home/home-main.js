const isHostKey = 'isHost';

function main() {
  const hostMatchButton = document.getElementById('host-button');
  hostMatchButton.addEventListener('click', () => {
    localStorage.setItem(isHostKey, JSON.stringify('true'));
    window.location.href = 'waiting-room.xhtml';
  });

  const joinMatchButton = document.getElementById('join-key');
  joinMatchButton.addEventListener('click', () => {
    // Make fetch call to server endpoint to authenticate given key.
  });
}

window.addEventListener('load', main);
