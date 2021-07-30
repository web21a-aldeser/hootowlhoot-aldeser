class HomeController {
  getHomePage(req, res) {
    res.render('home', {
      title: 'Home',
      stylesheets: ['/CSS/home.css'],
      scripts: ['/js/home/home-main.js', '/js/common.js']
    });
  }
}

const home = new HomeController();
export default home;
