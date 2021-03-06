var pages = {
    home: require('./route/page/home'),
    entrance: require('./route/page/entrance'),
    channel: require('./route/page/channel'),
    item: require('./route/page/item'),
    signin: require('./route/page/signin'),
    auth: require('./route/page/auth')
};

var apis = {
    channel: require('./route/api/channel'),
    item: require('./route/api/item'),
    subscription: require('./route/api/subscription'),
    user: require('./route/api/user'),
    list: require('./route/api/list'),
    search: require('./route/api/search'),
    auth: require('./route/api/auth')
};

var routes = [
    //method, path, handler, needAuth, devOnly
    ['get', '/', pages.home],
    ['get', '/welcome', pages.entrance],
    ['get', '/signin', pages.signin],
    ['get', '/auth/:type', pages.auth],
    ['get', '/channel/:cid', pages.channel],
    ['get', '/my/channel/:cid', pages.channel],
    ['get', '/recommend/channel/:cid', pages.channel],
    ['get', '/item/:iid', pages.item],
    ['get', '/my/item/:iid', pages.item],
    ['get', '/recommend/item/:iid', pages.item],

    //method, path, handler, needAuth, devOnly
    ['get', '/api/channel', apis.channel.get],
    ['post', '/api/channel/create', apis.channel.create],
    ['post', '/api/channel/save', apis.channel.save],
    ['post', '/api/channel/vote', apis.channel.vote],

    ['get', '/api/item', apis.item.get],
    ['get', '/api/subscription', apis.subscription.get, true],
    ['post', '/api/subscription/add', apis.subscription.add, true],
    ['post', '/api/subscription/remove', apis.subscription.remove, true],
    ['post', '/api/subscription/read', apis.subscription.read, true],

    ['get', '/api/user', apis.user.get, true],

    //method, path, handler, needAuth, devOnly
    ['post', '/api/signin', apis.auth.in],
    ['get', '/api/signout', apis.auth.out],

    //method, path, handler, needAuth, devOnly
    ['get', '/api/list/item', apis.list.item],
    ['get', '/api/list/channel', apis.list.channel],
    ['get', '/api/list/subscription', apis.list.subscription, true],

    //method, path, handler, needAuth, devOnly
    ['get', '/api/search/channel', apis.search.channel]
];

var isDEV = process.env.NODE_ENV !== 'production';
var route, handler;
var notFound = function(req, res){
    res.send(404);
};
var needAuth = function(handler){
    return function (req, res) {
        if(!req.session.uid){
            if(req.get('isAjax')){
                res.json({
                    err: 'need auth.'
                });
            }else{
                res.redirect('/signin?target='+encodeURIComponent(req.url));
            }
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
}

exports.routes = routes;