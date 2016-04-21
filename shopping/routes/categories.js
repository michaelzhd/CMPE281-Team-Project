var express = require('express');
var router = express.Router();

var blogEngine = require('../public/javascripts/blog');

/* GET home page. */

var products;
/* GET home page. */
router.get('/', function(req, res, next) {

  var url = 'http://54.187.124.117:3000/movie'
  var http = require('http');
  http.get(url ,function callback(response){
    response.setEncoding('utf8');
    var body = '';
    response.on("data", function (data) {
      body += data;
    });
    response.on("error", function (err) {
      console.log('error');
    });
    response.on('end',function(){
      products = JSON.parse(body);
      res.render('categories', { movies: products});
    });
  });

  // res.render('productlist', { movies: blogEngine.movie() });
});

module.exports = router;
