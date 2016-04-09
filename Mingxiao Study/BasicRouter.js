'use strict';

const http = require('http');
const url = require('url');

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