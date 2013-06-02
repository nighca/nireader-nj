var mysql = require('mysql');
var querystring = require('querystring');

var typeMap = {
    "number" : "int",
    "string" : "nvarchar(40)",
    "longstring" : "nvarchar(100)",
    "text" : "nvarchar(1000)",
    "longtext" : "nvarchar(8000)",
    "time" : "datetime"
};

var tables = {};

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

    var tableName = table;
    var tableStruct = struct;

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
            tableStruct[name] = type;
            type = typeMap[type];
            query = query + name + ' ' + type + ', ';
        }
    }
    query += 'PRIMARY KEY(id))';
    
    //此处逻辑有问题，正确的逻辑是create table完成后对tables[tableName]进行赋值
    //但这样在require()之后马上进行的insert会报错
    //可以通过使用回调函数实现正确的逻辑，此处暂时提前对tables赋值，回调的实现方式待想清楚
    tables[tableName] = tableStruct;
    console.log(tables);//---------------------------------------
    
    doQuery(pool, query, function(err, results){
        if(!err){
            //create table完成后对tables[tableName]进行赋值
        }
        callback && callback(err, results);
    });
};

Date.prototype.dbFormat = function() {
    var stamp = this.valueOf()/1000;
    return 'FROM_UNIXTIME(' + stamp + ')';
};

var formatVal = function(val){
    //console.log(val);//------------------------------
    var temp = val;
    if(val.dbFormat){
        temp = val.dbFormat();
    }else{
        try{
            temp = mysql.escape(temp);
        }catch(err){
            temp = mysql.escape(JSON.stringify(temp));
        };    
    }
    //console.log(temp);//----------------------------
    return temp;
};

var insertItem = function(pool, table, obj, callback) {
    var query = 'INSERT INTO ' + table + ' ';
    var names = [], values = [];
    for(var name in obj){
        if(obj.hasOwnProperty(name) && obj[name]!==null && tables[table][name]){
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
        if(obj.hasOwnProperty(name) && obj[name]!==null){
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