var db = require("./database");
var config = require("../config/db.json");

var pool;

var initDB = function () {
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var db_info = env["mysql-5.1"][0]["credentials"];

        config.host = db_info["host"];
        config.port = db_info["port"];
        config.user = db_info["username"];
        config.password = db_info["password"];
        config.database = db_info["name"];
    }
    pool = db.initDB(config);
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