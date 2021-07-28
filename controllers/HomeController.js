class HomeController {
  getHomePage(req, res) {
    console.log('ETA ETA ETA HOME');
    res.render('home', {
      title: 'Home',
      stylesheets: ['/CSS/home.css'],
      scripts: ['/js/home/home-main.js']
    });
  }
}

const homeController = new HomeController();
export default homeController;
