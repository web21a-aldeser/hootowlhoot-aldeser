class ArenaController {
  getArenaPage(req, res) {
    res.render('arena', {
      title: 'Arena',
      stylesheets: ['/CSS/arena.css'],
      scripts: ['/js/arena/arena-main.js', '/js/common.js']
    });
  }
}

const arena = new ArenaController();
export default arena;
