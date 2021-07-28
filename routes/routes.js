import express from 'express';
import path from 'path';
import log from '../controllers/LogController.js';
import error from '../controllers/ErrorController.js';
import authentication from '../controllers/AuthenticationController.js';
import home from '../controllers/HomeController.js';
import waitingRoom from '../controllers/WaitingRoomController.js';
import arena from '../controllers/ArenaController.js';

const router = express.Router();

// Logger controller.
router.use((req, res, next) => {
  log.logHttpRequest(req, res, next);
});

// parse application/x-www-form-urlencoded
router.use(express.urlencoded({extended: false}));

// parse application/json
router.use(express.json());

// serve home page
router.get('/', (req, res) => {
  home.getHomePage(req, res);
});

// serve waiting room page
router.get('/waiting-room', (req, res) => {
  waitingRoom.getWaitingRoomPage(req, res);
});

// serve arena page
router.get('/arena', (req, res) => {
  arena.getArenaPage(req, res);
});

// serve public static content
router.use('/', express.static(path.join(process.cwd(), 'public')));

router.post('/join-session', (req, res, next) => {
  authentication.authenticatePlayer(req, res, next);
});

// Error controller.
router.use((req, res) => {
  error.getNotFound(req, res);
});

export default router;
