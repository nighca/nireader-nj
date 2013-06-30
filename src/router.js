var routes = require('./routes');
var signin = require('./routes/signin');
var list = require('./routes/list');
var item = require('./routes/item');
var channel = require('./routes/channel');
var user = require('./routes/user');
var subscription = require('./routes/subscription');

var routes = [
	//method, path, handler, isPublic
	['get', '/', routes.index, true],

	['get', '/signin', signin.page, true],
	['post', '/signin', signin.check, true],

	['get', '/list', list.index],
	['get', '/list/item', list.item],

	['get', '/channel/:cid/item/:iid', item.get],
	['get', '/channel/:cid', channel.get],
	['post', '/channel/', channel.add],

	['get', '/user/:uid/channel/:cid/item/:iid', item.get],
	['get', '/user/:uid/channel/:cid', channel.userGet],
	['get', '/user/:uid', user.get],
	['post', '/user/', user.add],

	['get', '/subscription/:sid', subscription.get],
	['post', '/subscribe/', subscription.add],
	['post', '/unsubscribe/', subscription.remove]
];

var route;
var authHandler = function(handler){
	return function (req, res) {
		if(!req.session.uid){
			res.redirect('/signin?target='+encodeURIComponent(req.url));
			return;
		}
		handler(req, res);
	};
};
for (var i = 0, l = routes.length; i < l; i++) {
	route = routes[i];
	var handler = route[3] ? route[2] : authHandler(route[2]);
	routes[i] = {
		method: route[0],
		path: route[1],
		handler: handler
	};
};


exports.routes = routes;