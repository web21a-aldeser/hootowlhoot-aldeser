import express from 'express';
import router from './routes/routes.js';

const port = 3000;
const app = express();
app.use(router);
app.disable('x-powered-by');
app.listen(port);
