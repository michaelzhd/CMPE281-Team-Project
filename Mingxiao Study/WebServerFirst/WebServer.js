'use strict'

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
	'.htm' : 'text/html',
	'.css' : 'text/css', 
	'.js' : 'text/javascript',
	'.gif' : 'image/gif'
}

function webserver(req, res) {
	// if the route requested is '/', then load 'index.htm' or load the requested files
	let baseURI = url.parse(req.url);
	let filePath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
	
	fs.access(filePath, fs.F_OK, error => {
		if (!error) {
			// read and server the file
			fs.readFile(filePath, (error, content) => {
				if (!error) {
					// Resolve the content type
					// Server the file
					let contentType = mimes[path.extname(filePath)];
					res.writeHead(200, {'Content-type' : contentType});
					res.end(content, 'utf-8');
				} else {
					// return 500 error
					res.writeHead(500);
					res.end('the server could not read the file');
				}
			});
		} else {
			// return 404 error
			res.writeHead(404);
			res.end('Content not found');
		}
	});
}


http.createServer(webserver).listen(3000, () => {
	console.log('server running on port 3000...');
})