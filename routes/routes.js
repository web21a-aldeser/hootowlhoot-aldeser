
import express from 'express';
import path from 'path';
import log from '../controllers/LogController.js';
import error from '../controllers/ErrorController.js';
import arena from '../controllers/ArenaController.js';

const router = express.Router();

// Logger controller.
router.use((req, res, next) => { log.logHttpRequest(req, res, next); });

// parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }))

// parse application/json
router.use(express.json())

// serve public content
router.use('/', express.static(path.join(process.cwd(), 'public')));

// Arena controller.
router.post('/game', (req, res, next) => { arena.renderArena(req, res, next); });

// Error controller.
router.use((req, res) => { error.getNotFound(req, res); });

export default router;