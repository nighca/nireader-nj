var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./router').routes,
    task = require('./task'),
    domains = require('./config/domain.json'),
    cookieSessionConfig = require('./config/cookieSession.json');

var app = express();

app.configure(function(){
    app.set('views', path.join(__dirname, 'view'));
    app.set('view engine', 'jade');
    
    app.use(express.static(path.join(__dirname, '../static')));

    app.use(express.bodyParser());
    app.use(express.cookieParser(cookieSessionConfig.cookie.secret));
    app.use(require('./middleware/dealSession')());
    app.use(express.cookieSession(cookieSessionConfig.cookieSession));

    app.use(express.methodOverride());
    app.use(app.routes);
});

app.configure('development', function(){
    app.set('port', process.env.PORT || 3000);

    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

app.configure('production', function(){
    app.set('port', process.env.PORT || 80);
});

// add static domain in params while render
var render = require('jade').renderFile;
app.engine('jade', function(path, options, fn){
    options.DOMAINS = domains[process.env.NODE_ENV || 'development'];
    return render(path, options, fn);
});

var route;
for (var i = 0; i < routes.length; i++) {
    route = routes[i];
    app[route.method](route.path, route.handler);
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
