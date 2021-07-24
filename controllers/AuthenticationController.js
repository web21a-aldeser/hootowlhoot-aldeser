import sessionManager from './SessionsManager.js';

class AuthenticationController {
  constructor() {}

  authenticatePlayer(req, res, next) {
    const credentials = req.body;
    const sessionAvailable = sessionManager.doesTheSessionExists(credentials.session_key);
    if (sessionAvailable) {
      console.log('The session does exists');
      const success = {
        success: true
      };
      res.json(JSON.stringify(success));
      // ToDo: Create new controller to handle players who join the match to create them
      // and render them in the waiting room.
    } else {
      console.log('The session does not exist');
      const error = {
        error_code: 700,
        message: 'Session not found'
      };
      res.json(JSON.stringify(error));
    }
  }
}

const authentication = new AuthenticationController();
export default authentication;
