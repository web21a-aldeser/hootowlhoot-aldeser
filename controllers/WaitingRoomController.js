class WaitingRoomController {
  getWaitingRoomPage(req, res) {
    res.render('waiting-room', {
      title: 'Waiting Room',
      stylesheets: ['/CSS/waiting-room.css'],
      scripts: ['/js/common.js', '/js/waiting-room/waiting-room-main.js']
    });
  }
}

const waitingRoom = new WaitingRoomController();
export default waitingRoom;
