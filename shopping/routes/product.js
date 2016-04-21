var express = require('express');
var router = express.Router();

var blogEngine = require('../public/javascripts/blog');
//console.log( 'The area of a circle of radius 4 is ' + circle.area(4));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title:'product from jie', entries: blogEngine.getMovieInfo() });
 // res.render('productlist', { movies: blogEngine.movie() });
});

module.exports = router;
