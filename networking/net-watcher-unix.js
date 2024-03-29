'use strict';
const
	fs = require('fs'),
	net = require('net'),

	filename = process.argv[2],

	server = net.createServer(function(connection) {
		// reporting to the server
		console.log('Subscriber connected.');
		// reporting to the client
		connection.write("Now watching '" + filename + "' for changes...\n");

		// watcher setup
		let watcher = fs.watch(filename, function() {
			// Send a message to the client when the file changes
			connection.write("File '" + filename + "' changed: " + Date.now() + "\n");
		});

		// Send a message to the console when client disconects
		connection.on('close', function() {
			console.log('Subscriber disconnected.');
			watcher.close();
		});

	});

	if (!filename) {
		throw Error('No target filename was specified.');
	}

server.listen('/tmp/watcher.sock', function() {
	console.log('Listening for subscribers...');
});



