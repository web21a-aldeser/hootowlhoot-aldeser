import express from 'express';
import router from './routes/routes.js';
import ws from 'ws';

const port = 3000;
const app = express();
app.use(router);

const clientsWebsockets = new Map();

// https://masteringjs.io/tutorials/express/websockets
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket) => {

  clientsWebsockets.set(socket, `${clientsWebsockets.size + 1}`);
  console.log('A new web socket client has connected');

  socket.on('message', (message) => {
    const json = JSON.parse(message);
    console.log(json);
  });

  socket.on('close', () => {
    console.log(`${clientsWebsockets.get(socket)} closed the connection`);
    clientsWebsockets.delete(socket);
  });
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
