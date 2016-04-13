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

function streamFile(filePath) {
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(filePath);

		fileStream.on('open', () => {
			resolve(fileStream);
		})

		fileStream.on('error', () => {
			reject(error);
		})
	});
}


function webserver(req, res) {
	// if the route requested is '/', then load 'index.htm' or load the requested files
	let baseURI = url.parse(req.url);
	let filePath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
	let contentType = mimes[path.extname(filePath)];

	fileAccess(filePath)
		.then(streamFile)
		.then(fileStream => {
			res.writeHead(200, {'Content-type' : contentType});
			//res.end(content, 'utf-8');
			fileStream.pipe(res);
		})
		.catch(error => {
			res.writeHead(404);
			res.end(JSON.stringify(error));
		});
}


http.createServer(webserver).listen(3000, () => {
	console.log('server running on port 3000...');
})