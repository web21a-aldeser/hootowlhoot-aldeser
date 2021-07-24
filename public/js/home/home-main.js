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
    // Make fetch call to server endpoint to authenticate given key.
    const joinGameInput = document.getElementById('join-key-input');
    const gameKey = joinGameInput.value;
    const inputEmpty = gameKey === '';

    if (!inputEmpty) {
      const parameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({session_key: gameKey})
      };

      const url = 'http://localhost:3000/join-session';

      fetch(url, parameters)
        .then((res) => res.json())
        .then((data) => {
          const response = JSON.parse(data);
          if (response.hasOwnProperty('success')) {
            window.location.href = 'waiting-room.xhtml';
          } else {
            console.log(response.message);
          }
        })
        .catch((error) => {
          console.log({error});
        });
    } else {
      joinGameInput.placeholder = gameKeyRequired;
      joinGameInput.classList.add('input-error', 'text-error');
    }
  });
}

window.addEventListener('load', main);
