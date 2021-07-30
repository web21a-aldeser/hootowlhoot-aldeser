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
      // This will tell session manager that when the client opens the websocket it must create a new player.
      sessionManager.rememberToAssignPlayerToSession(credentials.session_key);
    } else {
      console.log('The session does not exist');
      const error = {
        error_code: 700,
        message: 'The session does not exist'
      };
      res.json(JSON.stringify(error));
    }
  }
}

const authentication = new AuthenticationController();
export default authentication;
