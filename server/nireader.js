/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./router').routes;

require('./task/runTasks');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
//app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret : "JustASimpleSecret" }));
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
};

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
