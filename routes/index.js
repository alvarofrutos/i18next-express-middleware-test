var express = require('express');
var router = express.Router();

/* GET A page. */
router.get('/page-a/', function(req, res, next) {
  res.render('page-a', { title: req.t('page-a.title'), });
});
/* GET B page. */
router.get('/page-b/', function(req, res, next) {
  res.render('page-b', { title: req.t('page-b.title'), });
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.t('index.title'), });
});

module.exports = router;
