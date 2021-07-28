import express from 'express';
import path from 'path';
import log from '../controllers/LogController.js';
import error from '../controllers/ErrorController.js';
import authentication from '../controllers/AuthenticationController.js';
import homeController from '../controllers/HomeController.js';

const router = express.Router();

// Logger controller.
router.use((req, res, next) => {
  log.logHttpRequest(req, res, next);
});

// parse application/x-www-form-urlencoded
router.use(express.urlencoded({extended: false}));

// parse application/json
router.use(express.json());

router.get('/', (req, res) => {
  homeController.getHomePage(req, res);
});

// serve public content
router.use('/', express.static(path.join(process.cwd(), 'public'), {index: 'home.xhtml'}));

router.post('/join-session', (req, res, next) => {
  authentication.authenticatePlayer(req, res, next);
});

// Error controller.
router.use((req, res) => {
  error.getNotFound(req, res);
});

export default router;
