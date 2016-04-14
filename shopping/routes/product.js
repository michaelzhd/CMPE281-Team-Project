var express = require('express');
var router = express.Router();

var blogEngine = require('../public/javascripts/blog');
//console.log( 'The area of a circle of radius 4 is ' + circle.area(4));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('product', { title:'product', entries: blogEngine.getBlogEntries() });
});

module.exports = router;
