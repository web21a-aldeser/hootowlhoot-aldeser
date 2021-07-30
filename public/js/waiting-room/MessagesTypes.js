const messagesTypes = {
  sessionCreated: 'sessionCreated',
  playerIdentity: 'playerIdentity',
  guestPlayerSuccessfullyJoined: 'joinedSuccessfully',
  newPlayer: 'newPlayer',
  currentPlayers: 'currentPlayers',
  playerNameUpdate: 'playerNameUpdate',
  avatarUpdated: 'avatarUpdated',
  reauthentication: 'reauthentication',
  matchStarted: 'matchStarted',
  isHostKey: 'isHost',
  meteoriteMovement: 'meteoriteMovement',
  currentTurn: 'currentTurn',
  cardSync: 'cardSync',
  createBoard: 'createBoard',
  turnInformation: 'turnInfo',
  movementInfo: 'movementInfo',
  checkWin: 'checkWin',
  checkLose: 'checkLose',
  requestBoard: 'requestBoard'
};

export default messagesTypes;
