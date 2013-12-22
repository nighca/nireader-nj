var mysql = require('mysql');

var typeMap = {
    "number" : "int",
    "string" : "nvarchar(40)",
    "longstring" : "nvarchar(100)",
    "longlongstring" : "nvarchar(500)",
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
    if(val === null || val === undefined){
        return null;
    }
    if(val.dbFormat){
        temp = val.dbFormat();
    }else{
        try{
            temp = mysql.escape(temp);
        }catch(err){
            temp = mysql.escape(JSON.stringify(temp));
        }
    }
    //console.log(temp);//----------------------------
    return temp;
};

var insertItem = function(pool, table, obj, callback) {
    if(obj.id){
        callback && callback('Can not be saved (id assign failed).', null);
        return;
    }

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

var updateItem = function(pool, table, obj, callback) {
    if(!obj.id){
        callback && callback('Can not be updated (id needed).', null);
        return;
    }

    var query = 'UPDATE ' + table + ' item SET ';
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
        }else{
            query += ', ';
        }
        query += names[i] + ' = ' + values[i];
    }

    query += ' WHERE item.id = ' + obj.id;

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
    }
};

var makeQuery = function(query, opts, sort, limit, fuzzy){
    if(typeof opts === 'string'){
        query += ' WHERE ' + opts;
    }else if(fuzzy){
        // need better query method
        var searchArea = ' CONCAT(IFNULL(' + opts.names.join(',""), IFNULL(') + '," ")) ';
        for (var i = 0, len = opts.keywords.length; i < len; i++) {
            if(i === 0){
                query += ' WHERE ';
            }else{
                query += ' AND ';
            }
            query += searchArea + ' LIKE "%' + opts.keywords[i] + '%"';
        }
    }else{
        var names = [], values = [];
        for(var name in opts){
            if(opts.hasOwnProperty(name) && opts[name] !== undefined && opts[name] !== null){
                names.push(name);
                values.push(formatVal(opts[name]));
            }
        }

        var i, len = names.length;
        for (i = 0; i < len; i++) {
            if(i === 0){
                query += ' WHERE ';
            }else{
                query += ' AND ';
            }
            query += names[i] + '=' + values[i];
        }
    }

    if(sort){
        var order = sort.order;
        var descrease = sort.descrease;
        query += ' ORDER BY ' + order;
        if(descrease){
            query += ' DESC';
        }
    }

    if(limit && limit.from && limit.num){
        limit.from = limit.from > 0 ? limit.from : 0;
        limit.num = limit.num > 0 ? limit.num : 0;
        query += ' LIMIT ' + limit.from + ', ' + limit.num;
    }

    return query;
};

var selectItem = function(pool, table, obj, callback, sort){
    var query = 'SELECT * FROM ' + table ;

    doQuery(pool, makeQuery(query, obj, sort), callback);
};

var deleteItem = function(pool, table, obj, callback){
    var query = 'DELETE FROM ' + table ;

    doQuery(pool, makeQuery(query, obj), callback);
};

var initDB = function(config){
    var pool  = mysql.createPool(config);
    return pool;
};

exports.makeQuery = makeQuery;
exports.doQuery = doQuery;
exports.createTable = createTable;
exports.insertItem = insertItem;
exports.insertItems = insertItems;
exports.updateItem = updateItem;
exports.selectItem = selectItem;
exports.deleteItem = deleteItem;
exports.initDB = initDB;