import express from 'express';
import path from 'path';

const port = 3000;
const app = express();

const publicMiddleware = express.static(path.join(process.cwd(), 'public'));
app.use('/', publicMiddleware);

app.listen(port);