var home = require('./route/home'),
    signin = require('./route/signin'),
    signout = require('./route/signout'),
    item = require('./route/item'),
    channel = require('./route/channel'),
    subscription = require('./route/subscription');

var routes = [
    //method, path, handler, isPublic, devOnly
    ['get', '/', home.get, true],

    ['get', '/signin', signin.get, true],
    ['get', '/signout', signout.get, false],
    ['post', '/signin', signin.post, true],

    ['get', '/item/:iid', item.get, false],
    ['get', '/channel/:cid', channel.get, false],
    ['post', '/channel/', channel.add, false]
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
var isDEV = !process.env.PRODUCTION;
var devHandler = function(handler){
    return function (req, res) {
        if(!isDEV){
            res.send(404);
            return false;
        }
        handler(req, res);
    };
};
var handler;
for (var i = 0, l = routes.length; i < l; i++) {
    route = routes[i];
    handler = route[3] ? route[2] : authHandler(route[2]);
    handler = route[4] ? devHandler(handler) : handler;
    routes[i] = {
        method: route[0],
        path: route[1],
        handler: handler
    };
};


exports.routes = routes;