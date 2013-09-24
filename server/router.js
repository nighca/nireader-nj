var pages = {
    home: require('./route/page/home'),
    channel: require('./route/page/channel'),
    item: require('./route/page/item'),
    signin: require('./route/page/signin')
};

var apis = {
    channel: require('./route/api/channel'),
    item: require('./route/api/item'),
    subscription: require('./route/api/subscription'),
    user: require('./route/api/user'),
    auth: require('./route/api/auth')
};

var routes = [
    //method, path, handler, needAuth, devOnly
    ['get', '/', pages.home],
    ['get', '/signin', pages.signin],
    ['get', '/channel/:cid', pages.channel],
    ['get', '/item/:iid', pages.item],

    //method, path, handler, needAuth, devOnly
    ['get', '/api/channel', apis.channel.get],
    ['get', '/api/item', apis.item.get],
    ['get', '/api/subscription', apis.subscription.get],

    ['get', '/api/user', apis.user.get, false, true],

    //method, path, handler, needAuth, devOnly
    ['post', '/api/signin', apis.auth.in, false, true],
    ['get', '/api/signout', apis.auth.out, false, true]
];


var isDEV = !process.env.PRODUCTION;
var route, handler;
var notFound = function(req, res){
    res.send(404);
};
var needAuth = function(handler){
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

    handler = route[3] ? needAuth(route[2]) : route[2];
    handler = 
        !route[4] ?
        handler :
        isDEV ? handler : notFound;

    routes[i] = {
        method: route[0],
        path: route[1],
        handler: handler
    };
};

exports.routes = routes;