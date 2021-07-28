class AftermatchController {
  getAfterMatchPage(req, res) {
    res.render('aftermatch', {
      title: 'Aftermatch',
      stylesheets: ['/CSS/aftermatch.css'],
      scripts: ['/js/common.js']
    });
  }
}

const aftermatch = new AftermatchController();
export default aftermatch;
