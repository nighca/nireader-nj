var db = require("./mysql");
var config = require("../../config");

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

initDB();

exports.initTable = initTable;
exports.insertItem = wrapFunc(db.insertItem, db);
exports.updateItem = wrapFunc(db.updateItem, db);
exports.insertItems = wrapFunc(db.insertItems, db);
exports.selectItem = wrapFunc(db.selectItem, db);
exports.deleteItem = wrapFunc(db.deleteItem, db);