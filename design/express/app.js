import express from 'express';
import path from 'path';
const port = 3000;

// app is a function that is registered with the server.
// Every time a new request arrives, app is called.
const app = express();

// Next is a way in which we can establish a middleware chain via next argument 
// which is a pointer to the next middleware function that must be called in the chain.
// With app.use, we register a new middleware functions.

// There are two possible paths that every middleware function can follow. The
// first one is to call send method and break the chain and, the second one is to 
// execute some work and continue with the middlewares chain via next.
function log(req, res, next) {
  console.log(`Request method: ${req.method}\nRequest URI: ${req.url}`);
  next();
}

// Every type of request is served by app.use registered middleware functions.
// The order does matter when registering middleware functions with app.use.
// They are called in the order they were registered.
// These are alternatives to app.use:
// app.get
// app.post
// app.update
// app.delete
// app.all (exact path match)

// Middleware function #1
app.use('/', log);
// This program will not run because there is no symbolic link named public.
// What we have to serve here is our html code...
const publicMiddleware = express.static(path.join(process.cwd(), 'public'));
// Middleware function #2
app.use(publicMiddleware);
// Middleware function #3
// The last middleware function in the chain should be used as the default case.
app.get('/', (req, res, next) => {
  res.send('<h1>Board game</h1>')
});
app.listen(port, () => {
  // This function is called before 
  console.log(`Server listening at port: ${port}`);
});