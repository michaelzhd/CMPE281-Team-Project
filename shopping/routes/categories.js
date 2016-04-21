var express = require('express');
var router = express.Router();

var blogEngine = require('../public/javascripts/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('categories', { movies: blogEngine.getMovieInfo() });
});

module.exports = router;
