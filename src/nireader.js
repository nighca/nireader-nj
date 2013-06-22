/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var list = require('./routes/list');
var channel = require('./routes/channel');
var http = require('http');
var path = require('path');

var db = require('./lib/db');

require('./task/runTasks');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/../views');
//app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/list', list.index);

app.get('/channel/get', channel.get);
app.post('/channel/add', channel.add);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
