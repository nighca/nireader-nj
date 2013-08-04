var db = require("./mysql");
var config = require("../../config.json");

var DBConfig = config.db;
var initialTables = config.tables;

var pool;

var initDB = function () {
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var db_info = env["mysql-5.1"][0]["credentials"];

        DBConfig.host = db_info["host"];
        DBConfig.port = db_info["port"];
        DBConfig.user = db_info["username"];
        DBConfig.password = db_info["password"];
        DBConfig.database = db_info["name"];
    }
    pool = db.initDB(DBConfig);
};

var initTable = function(name, struct, callback){
    db.createTable(pool, name, struct, callback);
};

var wrapFunc = function(func, _this){
    _this = _this || this;
    var wrapper =  function(){
        if(!pool){
            if(callback){
                callback('No db connection.');
            }
            return;
        }
        var args = [pool];
        //func.call(_this, pool, table, obj, callback);
        func.apply(_this, args.concat(Array.prototype.slice.call(arguments,0)));
    };
    return wrapper;
};

initDB();

exports.initTable = initTable;
exports.insertItem = wrapFunc(db.insertItem, db);
exports.updateItem = wrapFunc(db.updateItem, db);
exports.insertItems = wrapFunc(db.insertItems, db);
exports.selectItem = wrapFunc(db.selectItem, db);
exports.deleteItem = wrapFunc(db.deleteItem, db);
exports.doQuery = wrapFunc(db.doQuery, db);