import express from 'express';
import router from './routes/routes.js';
import ws from 'ws';
import GameSession from './models/GameSession.js';
import Player from './models/Player.js';

const port = 3000;
const app = express();
app.use(router);

const clientsWebsockets = new Map();
const sessions = [];
const messagesTypes = {
  createSession: 'createSession',
  sessionCreated: 'sessionCreated'
};
const hostPlayerId = 1;

// https://masteringjs.io/tutorials/express/websockets
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', (socket) => {
  socket.on('message', (rawMessage) => {
    // Get message type.
    const message = JSON.parse(rawMessage);
    const messageType = message.type;

    if (messageType === messagesTypes.createSession) {
      createNewSession(socket);
    }
    //const player = json.value.players_list[0];
    //console.log(player);
  });

  socket.on('close', () => {
    console.log(`${clientsWebsockets.get(socket)} closed the connection`);
    clientsWebsockets.delete(socket);
  });
});

function createNewSession(socket) {
  // It creates a new session and player for host.
  const session = new GameSession();
  const player = new Player(hostPlayerId);
  session.players.push(player);

  // It registers a new session on the server.
  sessions.push(session);

  const sessionAndHostIdentity = {
    type: messagesTypes.sessionCreated,
    value: {
      player_id: player.id,
      player_name: player.name,
      session_key: session.key
    }
  };

  // It sends player identity and session key to host player..
  socket.send(JSON.stringify(sessionAndHostIdentity));
}

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
