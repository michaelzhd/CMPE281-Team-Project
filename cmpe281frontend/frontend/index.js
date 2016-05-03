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
				req.session.movieInfo = parsed;
				res.render('pages/index', {
					data: parsed,
					MemberInfo: req.session.info,
				});
			} else {
				res.render('pages/index', {data : parsed});
			}
		});
 	});
});

app.get('/categories', function(req, res) {
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
				console.log(req.session.info);
				console.log(req.session.info.movieIDs);
				res.render('pages/categories', {
					movies: parsed,
					MemberInfo: req.session.info,
				});
			} else {
				res.render('pages/categories', {movies : parsed});
			}
		});
	});
});


app.get('/categories/:id', function(req, res) {
	var cid = req.params.id;
	http.get({ host: '54.187.124.117', port: '3000', path: '/category/' + req.params.id}, function(response) {

		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});

		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			if (req.session.info) {
				console.log(req.session.info);
				console.log(req.session.info.movieIDs);
				res.render('pages/categories', {
					cat : cid,
					movies: parsed,
					MemberInfo: req.session.info
				});
			} else {
				res.render('pages/categories', {cat : cid, movies : parsed});
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
			console.log('par:', parsed);
			if (req.session.info) {
				res.render('pages/movie', { data : parsed, MemberInfo : req.session.info});
			} else {
				res.render('pages/movie', { data : parsed });
			}
			
		});
 	});
});

// login
app.get('/login', function(req, res) {
	res.render('pages/login');
});

app.post('/login', function(req, res){
	var username = req.body.username;
	//console.log(username);
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


	http.get({ host: '54.187.124.117', port: '3000', path: '/user/'+ username}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});

 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body)[0];
			if(parsed == undefined) {
				res.json({result: false, msg : "invalid user!"});
				return;
			}

			if (parsed.password == pwd) {
				req.session.info = parsed;
				if(username != 'admin') {
		  			getCartInfo(req.session.info._id);
				} else {
					res.json({result : true, msg : req.session.info});
				}
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
	  response.setEncoding('utf8');
	  var result = '';
	  response.on('data', function(chunk)  {
	    result += chunk;
	  });
	  response.on('end', () => {
	  	var parsed = JSON.parse(result);
	  	if (parsed._id) {
	  		createCart(parsed);
	  	} else {
	  		res.json({result : false, msg : "register fail!"});
	  	}
	  })
	});

	request.on('error', function(e)  {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(user));
	request.end();

	var createCart = function (parsed) {
		var options = {
			hostname: '54.187.124.117',
			port: 3000,
			path: '/cart',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		var request2 = http.request(options, function(response) {
		  response.setEncoding('utf8');
		  var result = '';
		  response.on('data', function(chunk)  {
		    result += chunk;
		  });
		  response.on('end', () => {
		  	var p = JSON.parse(result);
		  	if (parsed._id) {
		  		res.json({result : true, msg : "register ok!"});
		  	} else {
		  		res.json({result : false, msg : "register fail!"});
		  	}
		  })
		});

		request2.on('error', function(e)  {
		  console.log(`problem with request: ${e.message}`);
		});
		request2.write(JSON.stringify({userId:parsed._id}));
		request2.end();
	};
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
	  response.on('data', function(chunk)  {
	    result += chunk;
	  });
	  response.on('end', () => {
	  	var parsed = JSON.parse(result);
	  	if (parsed.message === "user updated!") {
	  		req.session.info.username = username;
	  		req.session.info.email = email;
	  		res.json({result : true, MemberInfo : req.session.info});
	  	} else {
	  		res.json({result : false, msg : "register fail!"});
	  	}
	  })
	});

	request.on('error', function(e)  {
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
	//console.log(req.session.info);
	var movieIdList = req.session.info.movieIDs;
	var movieInfoList = [];
	//console.log('my mlist: ', movieIdList)
	if (movieIdList.length == 0) {
		res.render('pages/cart', {MemberInfo : req.session.info});
		return;
	}
	var getMovieNameList = function (movie) {
		movieInfoList.push(movie);
		if (movieInfoList.length == movieIdList.length) {
			//console.log('in if condi', req.session.info);
			movieInfoList.sort();
			res.render('pages/cart',  { data : movieInfoList, MemberInfo : req.session.info} );
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
				//console.log('in cart: ', parsed)
				var movie = {
					'id' : parsed._id,
					'title' : parsed.title,
					'price' : parsed.price
				};
				getMovieNameList(movie);
			});
	 	});
	});
});

app.post('/removeItem', function (req, res) {
	var id = req.body.id;
	console.log('id is: ', id)
	var options = {
		host: '54.187.124.117',
		port: 3000,
		path: '/cart/id/' + req.session.info.cartID,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	var movieList = req.session.info.movieIDs;
	var index = movieList.indexOf(id);
	movieList.splice(index, 1);

	var request = http.request(options, function(response) {
	  response.setEncoding('utf8');
	  var result = '';
	  response.on('data', function(chunk)  {
	    result += chunk;
	    //console.log(chunk);
	  });
	  response.on('end', () => {
	  	var parsed = JSON.parse(result);
		console.log(parsed);
	  	if (parsed._id) {
	  		res.json({result : true, data : parsed});
	  	} else {
	  		res.json({result : false, msg : "register fail!"});
	  	}
	  })
	});

	request.on('error', function(e)  {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(movieList));
	request.end();
});

app.get('/admin', function (req, res) {
	if (req.session.info == undefined) {
		res.redirect('/login');
		return;
	}
	else {
		http.get({host:'54.187.124.117', port:'3000', path:'/movie'}, function (response) {
			var moviesBody = '';
			response.on('data', function (data) {
				moviesBody += data;
			});

			response.on('end', function () {
				var allMoives = JSON.parse(moviesBody);
				getUsers(allMoives);
			});
		});

		var getUsers = function (allMoives) {
			http.get({host:'54.187.124.117', port:'3000', path:'/user'}, function (response) {
				var usersBody = '';
				response.on('data', function (data) {
					usersBody += data;
				});

				response.on('end', function () {
					var allUsers = JSON.parse(usersBody);
					res.render('pages/admin', {result : true, movies : allMoives.sort(), users : allUsers.sort(), MemberInfo : req.session.info});
				});
			});		
		};
	}
});

app.post('/admin', function (req, res) {
	var data = req.body;

	if (data.type == 'movies') {
		request.del('http://54.187.124.117:3000/movie/id/'+ data.id, function (error,response,body) {
			let resBody = response.body;
			if (!error) {
				res.json({result : true, msg : resBody.message});
			} else {
				console.log(error);
				res.json({result : false, msg : 'Delete failure!'});
			}
		});
	} else {
		request.del('http://54.187.124.117:3000/user/id/'+ data.id, function (error,response,body) {
			let resBody = response.body;
			if (!error) {
				res.json({result : true, msg : resBody.message});
			} else {
				console.log(error);
				res.json({result : false, msg : 'Delete failure!'});
			}
		});
	}
});

app.post('/addToCart', function (req, res) {
	var addId = req.body.movieId;
	var cart = req.session.info.movieIDs;
	
	cart.push(addId);
	//console.log('cart is: ', cart);
	var newCart = {
		movieId : cart,
	}

	var options = {
		hostname: '54.187.124.117',
		port: 3000,
		path: '/cart/id/' + req.session.info.cartID,
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
		response.on('data', function(chunk)  {
			result += chunk;
			console.log(chunk);
		});
		response.on('end', () => {
			var parsed = JSON.parse(result);
			console.log('parsed: ', parsed)
			if (typeof parsed != undefined) {
				res.json({result : true});
			} else {
				res.json({result : false, msg : "add fail!"});
			}
		})
	});

	request.on('error', function(e)  {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(newCart));
	request.end();
});

app.get('/editMovie/:id', function (req, res) {
	http.get({ host: '54.187.124.117', port: '3000', path: '/movie/id/' + req.params.id}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		
 		response.on('end', function() {
			var parsed = JSON.parse(body)[0];
			//console.log(parsed);
			if (req.session.info) {
				res.render('pages/editmovie', { data : parsed, MemberInfo : req.session.info});
			} else {
				res.redirect('/login');
				return;
			}
		});
 	});
});

app.get('/editUser/:id', function (req, res) {
	//console.log('req is:', req.params.id)
	http.get({ host: '54.187.124.117', port: '3000', path: '/user/id/' + req.params.id}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});
		
 		response.on('end', function() {
			var parsed = JSON.parse(body)[0];
			//console.log(parsed);
			if (req.session.info) {
				res.render('pages/edituser', { data : parsed, MemberInfo : req.session.info });
			} else {
				res.redirect('/login');
				return;
			}
		});
 	});
})

app.post('/editUser', function (req, res) {
	var id = req.body.id;
	console.log(id)
	var options = {
		host: '54.187.124.117',
		port: 3000,
		path: '/user/id/' + id,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	var userInfo = {
		"email" : req.body.email,
		"username" : req.body.username,
		"password" : req.body.password
	};

	var request = http.request(options, function(response) {
		response.setEncoding('utf8');
		var result = '';
		response.on('data', function(chunk) {
			result += chunk;
		});
		response.on('end', function () {
			var parsed = JSON.parse(result);
			console.log('res is: ', parsed.message)
			if (parsed.message == 'user updated!') {
				res.json({result : true, msg: parsed.message});
			} else {
				res.json({result : false});
			}
		});
	});

	request.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	request.write(JSON.stringify(userInfo));
	request.end();
})

app.post('/editMovie', function (req, res) {

	var id = req.body.id;
	var options = {
		host: '54.187.124.117',
		port: 3000,
		path: '/movie/id/' + id,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	var movieInfo = {
		"price" : req.body.price,
		"year" : req.body.year,
		"director" : req.body.director,
		"title" : req.body.title,
		"image" : req.body.image,
		"category" : req.body.category
	}

	var request = http.request(options, function(response) {
		response.setEncoding('utf8');
		var result = '';
		response.on('data', function(chunk) {
			result += chunk;
		});
		response.on('end', function () {
			var parsed = JSON.parse(result);
			console.log('res is: ', parsed.message)
			if (parsed.message == 'movie updated!') {
				res.json({result : true, msg: parsed.message});
			} else {
				res.json({result : false});
			}
		});
	});

	request.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	request.write(JSON.stringify(movieInfo));
	request.end();
});

app.get('/editUser', function (req, res) {
	if (req.session.info) {
		res.render('pages/editUser', {MemberInfo : req.session.info});
	} else {
		res.redirect('/login');
		return;
	}
});

app.get('/addMovie', function (req, res) {
	if (req.session.info) {
		res.render('pages/addmovie', {MemberInfo : req.session.info});
	} else {
		res.redirect('/login');
		return;
	}
});

app.post('/addMovie', function (req, res) {
	var options = {
	  hostname: '54.187.124.117',
	  port: 3000,
	  path: '/movie',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json'
	  }
	};
	var request = http.request(options, function(response) {
	  response.setEncoding('utf8');
	  var result = '';
	  response.on('data', function(chunk)  {
	    result += chunk;
	  });
	  response.on('end', () => {
	  	var parsed = JSON.parse(result);
	  	if (parsed._id) {
	  		res.json({result : true, msg : parsed.title});
	  	} else {
	  		res.json({result : false, msg : "add fail!"});
	  	}
	  })
	});

	request.on('error', function(e)  {
	  console.log(`problem with request: ${e.message}`);
	});
	request.write(JSON.stringify(req.body));
	request.end();
});

app.post('/checkout', function (req, res) {
	var total = req.body.total;
	// 1. update cart, clear all movies
	var movieList = {
		"movieId" : []
	};
	var options = {
		host: '54.187.124.117',
		port: 3000,
		path: '/cart/id/' + req.session.info.cartID,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	//console.log('options is: ', options);
	var request = http.request(options, function (response) {
		response.setEncoding('utf8');
		var result = '';
		
		response.on('data', function (chunk) {
			result += chunk;
		});
		response.on('end', function() {
			//console.log(result);
			var parsed = JSON.parse(result);
			//console.log('session is: ', req.session.info);
			if (parsed._id) {
				postOrder(total);
				//res.json({result : true, msg : parsed.title});
			} else {
				res.json({result : false, msg : "add fail!"});
			}
		})
	});

	request.on('error', function(e) {
	  console.log(`problem with request: ${e.message}`);
	});

	request.write(JSON.stringify(movieList));
	request.end();

	// 2. post into orders(alter session)
	var postOrder = function (totalPrice) {
		//console.log(req.session.info.movieIDs);
		var orderInfo = {
			"userId": req.session.info._id, // userid
			"movieId" : req.session.info.movieIDs,
			"totalAmount" : totalPrice
		};
		var options2 = {
			host: '54.187.124.117',
			port: 3000,
			path: '/order',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		console.log('options is: ', options2);
		var request2 = http.request(options2, function (response) {
			response.setEncoding('utf8');
			var result = '';
			
			response.on('data', function (chunk) {
				result += chunk;
			});
			response.on('end', () => {
				//console.log(result);
				var parsed = JSON.parse(result);
				req.session.info.movieIDs = [];
				if (parsed._id) { //cart id
					res.json({result : true, msg : parsed});
				} else {
					res.json({result : false, msg : "add fail!"});
				}
			})
		});

		request2.on('error', function(e) {
		  console.log(`problem with request: ${e.message}`);
		});

		request2.write(JSON.stringify(orderInfo));
		request2.end();
	};

});

app.get('/order', function (req, res) {
	console.log('order ', req.session.info);
	http.get({ host: '54.187.124.117', port: '3000', path: '/order/'+ req.session.info._id}, function(response) {
		// Continuously update stream with data
		var body = '';
		response.on('data', function(d) {
			body += d;
		});

 		response.on('end', function() {
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			console.log('order ', parsed);
			res.render('pages/order', {data : parsed, MemberInfo: req.session.info, MovieInfo : req.session.movieInfo});
		});
 	});
});
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