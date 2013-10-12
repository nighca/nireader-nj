/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./router').routes;

var dealSession = require('./middleware/dealSession');

require('./task');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());

//app.use(express.cookieParser('JustASimpleSecretForCookie'));
//app.use(express.session({secret: 'JustASimpleSecretForSession'}));
app.use(express.cookieParser('JustASimpleSecretForCookie'));
app.use(dealSession());
app.use(express.cookieSession({
	key: 'WhoAmI',
	secret: 'JustASimpleSecretForSession',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));

app.use(express.methodOverride());
app.use(app.routes);
app.use(express.static(path.join(__dirname, '../static')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var route;
for (var i = 0; i < routes.length; i++) {
    route = routes[i];
    app[route.method](route.path, route.handler);
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
