var express = require('express');
var app = express();
var http = require('http');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/', function(req, res) {
	http.get({ host: '54.187.124.117', port: '3000', path: '/movie'}, function(response) {
	// http.get({ host: 'localhost', port: '1337' }, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		console.log(body);
 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			// var parsed = JSON.parse(body);
			parsed = JSON.parse(body);
			res.render('pages/index', {data : parsed});
			// callback({ title: parsed.title, director: parsed.director, year: parsed.year, price: parsed.price });
		});
 	});
});

app.get(/^\/movie\/(\d+)$/, function(request, response) {
	response.render('pages/movie');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


