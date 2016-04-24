'use strict';

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express();
var http = require('http');
var async = require("async");
var request = require("request");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// for session access
app.use(cookieParser());
app.use(session({
	secret : 'keyboard cat',
	cookie : {/*secure : true*/}
	}));

// index.html
app.get('/', function(req, res) {
	http.get({ host: '54.187.124.117', port: '3000', path: '/movie'}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		
 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			if (req.session.info) {
				res.render('pages/index', {data : parsed, MemberInfo : req.session.info});
			} else {
				res.render('pages/index', {data : parsed});
			}
		});
 	});
});

// detail information
app.get('/movie/:id', function(req, res) {

	http.get({ host: '54.187.124.117', port: '3000', path: '/movie/id/' + req.params.id}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		
 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body)[0];
			//console.log(parsed);
			res.render('pages/movie', { data : parsed });
		});
 	});
});

// login
app.get('/login', function(req, res) {
	res.render('pages/login');
});

app.post('/login', function(req, res){
	var username = req.body.username;
	var pwd = req.body.pwd;
	if (username == '') return json_false(res, "Please input valid username");
	if (pwd == '') return json_false(res, "Please input valid password");

	// get cartID and movieIds after user logged in
	var getCartInfo = function (userID) {
		http.get({ host: '54.187.124.117', port: '3000', path: '/cart/'+ userID }, function (response) {
			var cartBody = '';
			response.on('data', function (data) {
				cartBody += data;
			});
			response.on('end', function () {
				var cartParsedData = JSON.parse(cartBody)[0];
				req.session.info.cartID = cartParsedData._id;
				req.session.info.movieIDs = cartParsedData.movieId;
				//console.log(req.session.info)
				res.json({result : true, msg : req.session.info});
			});
			response.on('error', function (err) {
				console.log(err);
			});
		})
	};


	http.get({ host: '54.187.124.117', port: '3000', path: '/user/'+username}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});

 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body)[0];
			if (parsed.password == pwd) {
				req.session.info = parsed;
		  		getCartInfo(req.session.info._id);
		  	} else {
		  		res.json({result : false, msg : "login fail!"});
		  	}
		});
 	});
});

// register information
app.get('/register', function(req, res) {
	res.render('pages/register');
});

app.post('/register', function(req, res){
	var username = req.body.username;
	var pwd = req.body.pwd;
	var pwd2 =  req.body.pwd2;
	var email =  req.body.email;
	if (username == '') return json_false(res, "Please input valid username");
	if (pwd == '') return json_false(res, "Please input valid password");
	if (pwd !== pwd2) return json_false(res, "Two password do not match");
	if(!email.match(/^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i)) return json_false(res, 'Please input valid email'); 
	var user = {
		"username" : username,
		"password" : pwd,
		"email" : email
	}
	var options = {
	  hostname: '54.187.124.117',
	  port: 3000,
	  path: '/user',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json'
	  }
	};
	var request = http.request(options, function(response) {
	  console.log(`STATUS: ${response.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
	  response.setEncoding('utf8');
	  var result = '';
	  response.on('data', (chunk) => {
	    result += chunk;
	    console.log(chunk);
	  });
	  response.on('end', () => {
	  	parsed = JSON.parse(result);
	  	if (parsed._id) {
	  		res.json({result : true, data : parsed});
	  	} else {
	  		res.json({result : false, msg : "register fail!"});
	  	}
	  })
	});

	request.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(user));
	request.end();
});

// profile page
app.get('/profile', function(req, res) {
	res.render('pages/profile', {MemberInfo : req.session.info});
});

app.post('/profile', function(req, res){
	var username = req.body.username;
	var email =  req.body.email;
	if (username == '') return json_false(res, "Please input valid username");
	if(!email.match(/^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i)) return json_false(res, 'Please input valid email'); 
	var user = {
		"username" : username,
		"password" : req.session.info.password,
		"email" : email
	}
	var options = {
	  hostname: '54.187.124.117',
	  port: 3000,
	  path: '/user/id/' + req.session.info._id,
	  method: 'PUT',
	  headers: {
	    'Content-Type': 'application/json'
	  }
	};
	var request = http.request(options, function(response) {
	  console.log(`STATUS: ${response.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
	  response.setEncoding('utf8');
	  var result = '';
	  response.on('data', (chunk) => {
	    result += chunk;
	    console.log(chunk);
	  });
	  response.on('end', () => {
	  	parsed = JSON.parse(result);
	  	if (parsed.message === "user updated!") {
	  		req.session.info.username = username;
	  		req.session.info.email = email;
	  		res.json({result : true, MemberInfo : req.session.info});
	  	} else {
	  		res.json({result : false, msg : "register fail!"});
	  	}
	  })
	});

	request.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(user));
	request.end();
});

// logout
app.get('/logout', function(req, res) {
	req.session.destroy(function (err) {
		if (err) throw err;
		res.redirect('/');
	});
});

app.get('/cart', function (req, res) {
	console.log(req.session.info);
	var movieIdList = req.session.info.movieIDs;
	var movieInfoList = [];

	var getMovieNameList = function (movie) {
		movieInfoList.push(movie);
		if (movieInfoList.length == movieIdList.length) {
			//console.log('in if condi', movieInfoList);
			movieInfoList.sort();
			res.render('pages/cart',  {data : movieInfoList} );
		}
	}

	async.map(movieIdList, function(url, callback) {
		http.get({ host: '54.187.124.117', port: '3000', path: '/movie/id/'+ url}, function(response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function(d) {
				body += d;
			});
			
	 		response.on('end', function() {
				// Data reception is done, do whatever with it!
				var parsed = JSON.parse(body)[0];
				var movie = {
					'title' : parsed.title,
					'price' : parsed.price
				};
				getMovieNameList(movie);
			});
	 	});
	});
})

app.post('/addToCart', function (req, res) {
	req.params.id
})

function json_false (res, msg) {
	res.json({ result : false, msg : msg });
	return void(null);
}

function json_true (res, data) {
	res.json({ result : true, data : data });
	return void(null);
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});