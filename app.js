import express from 'express';
import router from './routes/routes.js';
import ws from 'ws';
import webSocketServerManager from './controllers/WebSocketServerManager.js';
import broadcaster from './utilities/Broadcaster.js';
import * as eta from 'eta';

const port = 3000;
const app = express();
app.use(router);

// Set Eta as view engine
app.engine('eta', eta.renderFile);
app.set('view engine', 'eta');

// https://masteringjs.io/tutorials/express/websockets
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({noServer: true});
broadcaster.configure(wsServer);
webSocketServerManager.configure(wsServer);

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
