var r = require('rethinkdb');
var _ = require('lodash');
var irc_client = require('irc').Client;

var servers = [];
var clients = [];
var connection = null;

r.connect({ db: 'hirc' })
.then(function(con) {
	connection = con;
})
.then(null, function(err) {
	console.error(err);
	// TODO exit
})
.then(function() {
	return r.table('servers').run(connection)
	.then(function(cursor) {
		return cursor.toArray();
	})
	.then(function(ary) {
		servers = ary;
	});
})
.then(function() {
	servers.forEach(function(srv) {
		var nicks = _.isArray(srv.nick) ? srv.nick : [ srv.nick ];
		nicks.forEach(function(nick) {
			var client = new irc_client(srv.url, nick, {
				port: srv.port || 6667,
				channels: srv.channels,
			});

			clients.push(client);
		});
	});
})
.then(function() {
	clients.forEach(function(client) {
		client.addListener('message', (a,b,c) => console.log('m', a,b,c));
		client.addListener('pm', (a,b,c) => console.warn('p', a,b,c));
		client.addListener('error', (a,b,c) => console.error('e', a,b,c));
	});
});
