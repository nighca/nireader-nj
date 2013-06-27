var routes = require('./routes');
var list = require('./routes/list');
var item = require('./routes/item');
var channel = require('./routes/channel');
var user = require('./routes/user');
var subscription = require('./routes/subscription');

var routes = [
	['get', '/', routes.index],
	['get', '/list', list.index],

	['get', '/channel/:cid/item/:iid', item.get],
	['get', '/channel/:cid', channel.get],
	['post', '/channel/', channel.add],

	['get', '/user/:uid', user.get],
	['post', '/user/', user.add],

	['get', '/subscription/:sid', subscription.get],
	['post', '/subscription/', subscription.add]
];

var route;
for (var i = 0, l = routes.length; i < l; i++) {
	route = routes[i];
	routes[i] = {
		type: route[0],
		path: route[1],
		handler: route[2]
	};
};


exports.routes = routes;