var mysql = require('mysql');
var querystring = require('querystring');

var typeMap = {
    "number" : "int",
    "string" : "nvarchar(40)",
    "text" : "nvarchar(8000)"
};

var doQuery = function (pool, query, callback) {
    pool.getConnection(function(err, connection) {
        if(err){
            if(callback){
                callback(err);
            }
            return;
        }
        query = query + ';';
        //console.log('$: ', query);//-------------------------------
        connection.query(query, function(err, results){
            connection.end();
            if(callback){
                callback(err, results);
            }
        });
    });
};

var createTable = function(pool, table, struct, callback) {
    var query = 'CREATE TABLE IF NOT EXISTS ' + table + '(id int NOT NULL auto_increment, ';
    var name, type;
    for(name in struct){
        if(name === 'id'){
            if(callback){
                callback('struct name: ' + name + ' forbidden.', null);
            }
            return;
        }
        if(struct.hasOwnProperty(name)){
            type = struct[name];
            if(!typeMap.hasOwnProperty(type)){
                if(callback){
                    callback("Unrecognizable type: " + type, null);
                }
                return;
            }
            type = typeMap[type];
            query = query + name + ' ' + type + ', ';
        }
    }
    query += 'PRIMARY KEY(id))';

    doQuery(pool, query, callback);
};

var formatVal = function(val){
    var temp = val;
    if(val.dbFormat){
        temp = val.dbFormat();
    }
    //temp = JSON.stringify(val);
    return mysql.escape(temp);
};

var insertItem = function(pool, table, obj, callback) {
    var query = 'INSERT INTO ' + table + ' ';
    var names = [], values = [];
    for(var name in obj){
        if(name === 'id'){
            if(callback){
                callback('obj name: ' + name + ' forbidden.', null);
            }
            return;
        }
        if(obj.hasOwnProperty(name)){
            names.push(name);
            values.push(formatVal(obj[name]));
        }
    }

    var i,  len = names.length;
    for (i = 0; i < len; i++) {
        if(i === 0){
            query += '(';
        }else{
            query += ', ';
        }
        query += names[i];
    }
    for (i = 0; i < len; i++) {
        if(i === 0){
            query += ')VALUES(';
        }else{
            query += ', ';
        }
        query += values[i];
        if(i === len - 1){
            query += ')';
        }
    }

    doQuery(pool, query, callback);
};

var insertItems = function(pool, table, objs, callback){
    var notFinished = 0;
    var error = null;
    for (var i = 0, l = objs.length; i < l; i++) {
        notFinished++;
        insertItem(pool, table, objs[i], function(err, results){
            notFinished--;
            if(err){
                error = error || [];
                error.push(err);
            }
            if(!notFinished){
                callback(error, null);
            }
        });
    };
};

var selectItem = function(pool, table, obj, callback){
    var query = 'SELECT * FROM ' + table ;
    var names = [], values = [];
    for(var name in obj){
        if(obj.hasOwnProperty(name)){
            names.push(name);
            values.push(formatVal(obj[name]));
        }
    }

    var i,  len = names.length;
    for (i = 0; i < len; i++) {
        if(i === 0){
            query += ' WHERE ';
        }else{
            query += ' AND ';
        }
        query += names[i] + '=' + values[i];
    }

    doQuery(pool, query, callback);
};

var deleteItem = function(pool, table, obj, callback){
    var query = 'DELETE FROM ' + table ;
    var names = [], values = [];
    for(var name in obj){
        if(obj.hasOwnProperty(name)){
            names.push(name);
            values.push(formatVal(obj[name]));
        }
    }

    var i,  len = names.length;
    for (i = 0; i < len; i++) {
        if(i === 0){
            query += ' WHERE ';
        }else{
            query += ' AND ';
        }
        query += names[i] + '=' + values[i];
    }

    doQuery(pool, query, callback);
};

var initPool = function(config){
    var pool  = mysql.createPool(config);
    return pool;
};

exports.doQuery = doQuery;
exports.createTable = createTable;
exports.insertItem = insertItem;
exports.insertItems = insertItems;
exports.selectItem = selectItem;
exports.deleteItem = deleteItem;
exports.initPool = initPool;