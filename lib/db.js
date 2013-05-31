var db = require("./mysql");
var config = require("../config").db;

var pool;

var initialTables = {
    'article': {
        title : 'string',
        content : 'text'
    }
};

exports.init = function (callback) {
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var db_info = env["mysql-5.1"][0]["credentials"];

        config.host = db_info["host"];
        config.port = db_info["port"];
        config.user = db_info["username"];
        config.password = db_info["password"];
        config.name = db_info["name"];
    }
    console.log("DB config: ");
    for(var name in config){
        console.log(name, " : ", config[name]);
    }
    pool = db.initPool(config);

    db.createDatabase(pool, config.name, function(err, results){
        if(err){
            console.log('DB    ' + config.name + ' already occurs.');
            //console.log(err);
        }else{
            console.log('DB    ' + config.name + ' created.');
        }
        db.useDatabase(pool, config.name, function(err, results){
            if(err){
                console.log('DB    ' + config.name + ' unable to use.');
                //console.log(err);
            }else{
                console.log('DB    ' + config.name + ' used.');
                var notReady = 0;
                for(var tableName in initialTables){
                    if(initialTables.hasOwnProperty(tableName)){
                        notReady++;
                        db.createTable(pool, tableName, initialTables[tableName], function(err, results){
                            if(err){
                                console.log('TABLE ' + tableName + ' already occurs.');
                                //console.log(err);
                            }else{
                                console.log('TABLE ' + tableName + ' created.');
                            }
                            notReady--;
                            if(notReady === 0 && callback){
                                callback();
                            }
                        });
                    }
                }
            }
        });
    });
};

var wrapFunc = function(func, _this){
    _this = _this || this;
    var wrapper =  function(table, obj, callback){
        if(!pool){
            if(callback){
                callback('No db connection.');
            }
            return;
        }
        func.call(_this, pool, table, obj, callback);
    };
    return wrapper;
};

exports.insertItem = wrapFunc(db.insertItem, db);
exports.selectItem = wrapFunc(db.selectItem, db);
exports.deleteItem = wrapFunc(db.deleteItem, db);




