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
        console.log('$: ', query);//-------------------------------
        connection.query(query, function(err, results){
            connection.end();
            if(callback){
                callback(err, results);
            }
        });
    });
};

var createDatabase = function (pool, db, callback) {
    doQuery(pool, 'create database ' + db, callback);
};

var useDatabase = function (pool, db, callback) {
    doQuery(pool, 'use ' + db, callback);
};

var createTable = function(pool, table, struct, callback) {
    var query = 'create table ' + table + '(id int NOT NULL auto_increment, ';
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
    query += 'primary key(id))';

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
    var query = 'insert into ' + table + ' ';
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
            query += ')values(';
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

var selectItem = function(pool, table, obj, callback){
    var query = 'select * from ' + table ;
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
            query += ' where ';
        }else{
            query += ' and ';
        }
        query += names[i] + '=' + values[i];
    }

    doQuery(pool, query, callback);
};

var deleteItem = function(pool, table, obj, callback){
    var query = 'delete from ' + table ;
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
            query += ' where ';
        }else{
            query += ' and ';
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
exports.createDatabase = createDatabase;
exports.useDatabase = useDatabase;
exports.createTable = createTable;
exports.insertItem = insertItem;
exports.selectItem = selectItem;
exports.deleteItem = deleteItem;
exports.initPool = initPool;