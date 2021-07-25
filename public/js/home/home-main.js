const isHostKey = 'isHost';
const gameKeyRequired = 'You must specify a key';

function main() {
  const hostMatchButton = document.getElementById('host-button');
  hostMatchButton.addEventListener('click', () => {
    localStorage.setItem(isHostKey, JSON.stringify('true'));
    window.location.href = 'waiting-room.xhtml';
  });

  const joinMatchButton = document.getElementById('join-button');
  joinMatchButton.addEventListener('click', () => {
    localStorage.setItem(isHostKey, JSON.stringify('false'));
    // Make fetch call to server endpoint to authenticate given key.
    const joinGameInput = document.getElementById('join-key-input');
    const gameKey = joinGameInput.value;
    const inputEmpty = gameKey === '';

    if (!inputEmpty) {
      requestServerToJoinSession(gameKey);
    } else {
      joinGameInput.placeholder = gameKeyRequired;
      joinGameInput.classList.add('input-error', 'text-error');
    }
  });
}

function requestServerToJoinSession(gameKey) {
  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({session_key: gameKey})
  };

  // const url = 'http://localhost:3000/join-session';
  const url = `http://${window.location.host}/join-session`;

  fetch(url, parameters)
    .then((res) => res.json())
    .then((data) => {
      const response = JSON.parse(data);
      if (response.hasOwnProperty('success')) {
        console.log('The session does exist');
        window.location.href = 'waiting-room.xhtml';
      } else {
        showSessionNotFoundError(response);
      }
    })
    .catch((error) => {
      console.log({error});
    });
}

function showSessionNotFoundError(response) {
  console.log(response.message);
  const modal = document.getElementById('session-error-modal');
  modal.style.display = 'block';

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];
  // When the user clicks on <span> (x), close the modal
  span.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('load', main);
