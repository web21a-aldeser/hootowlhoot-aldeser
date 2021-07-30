class CreditsController {
  getCreditsPage(req, res) {
    res.render('credits', {
      title: 'Credits',
      stylesheets: ['/CSS/home.css'],
      scripts: ['/js/home/home-main.js', '/js/common.js']
    });
  }
}

const credits = new CreditsController();
export default credits;
