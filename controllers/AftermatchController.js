class AftermatchController {
  getAfterMatchPage(req, res) {
    res.render('aftermatch', {
      title: 'Aftermatch',
      stylesheets: ['/CSS/aftermatch.css'],
      scripts: ['/js/aftermatch/aftermatch-main.js','/js/common.js']
    });
  }
}

const aftermatch = new AftermatchController();
export default aftermatch;
