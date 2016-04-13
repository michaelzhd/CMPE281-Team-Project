'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
let routes = {
	'GET' : {
		'/' : (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>Hello Router</h1>');
		},
		'/about' : (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>This is about page</h1>');
		},
	},
	'POST' : {
		'/api/login' : (req, res) => {
			 let body = '';
			 req.on('data', data => {
			 	body += data;
			 	console.log(body.length);
			 	if (body.length > 10485760) {
			 		res.writeHead(413, {'Content-type' : 'text/hmtl'});
			 		res.end('no more than 10 MB')
			 		req.connection.destroy();
			 	}
			 });

			 req.on('end', () => {
			 	console.log(body);
			 	res.end();
			 })
		}
	}
}

function router(req, res) {
	let baseURI = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseURI.pathname];
	if (resolveRoute != undefined) {
		req.queryParams = baseURI.query;
		resolveRoute(req, res);
	} else {
		
	}
}

http.createServer(router).listen(3000, () => {
	console.log('Server running on port 3000');
})