var conf = require('./config.local.js');
var _ = require('lodash');
var irc_client = require('irc').Client;

var clients = [];

conf.servers.forEach(function(srv) {
	var nicks = _.isArray(srv.nick) ? srv.nick : [ srv.nick ];
	nicks.forEach(function(nick) {
		var client = irc_client(srv.url, nick, {
			port: srv.port || 6667,
			channels: srv.channels,
			autoConnect: false,
		});
		console.log(client);
		clients.push(client);
	});
});

clients.forEach(function(client) {
	client.addListener('message', (a,b,c) => console.log(a,b,c));
	client.addListener('pm', (a,b,c) => console.warn(a,b,c));
	client.addListener('error', (a,b,c) => console.error(a,b,c));
});
