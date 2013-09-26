var makeQuery = require('../../lib/database').makeQuery;
var doQuery = require('../../lib/data').doQuery;
var Item = require('../../model/item');
var Channel = require('../../model/channel');

var getSQLQuery = function(query, model){
    var opt, sort, limit, fields;
    if(query.opt){
        opt = {};
        if(query.opt.id){
            opt.id = query.opt.id;
        }
        for(var name in model.struct){
            if(model.struct.hasOwnProperty(name) && query.opt[name] !== null && query.opt[name] !== undefined){
                opt[name] = decodeURI(query.opt[name]);
            }
        }
    }
    if(query.sort && query.sort.order){
        sort = {
            order: decodeURI(query.sort.order),
            descrease: query.sort.descrease
        };
    }
    if(query.limit){
        limit = query.limit;
    }
    if(query.fields && query.fields.length){
        fields = [];
        for (var i = 0, l = query.fields.length; i < l; i++) {
            fields.push(decodeURI(query.fields[i]));
        };
    }

    //------------------------------------------------------
    /*console.log({
        opt: opt,
        sort: sort,
        limit: limit,
        fields: fields
    });*/
    //------------------------------------------------------

    var query = 'SELECT';
    if(fields){
        for (var i = 0, l = fields.length; i < l; i++) {
            if(i === 0){
                query += ' ';
            }else{
                query += ', ';
            }
            query += fields[i];
        }
    }else{
        query += ' *';
    }
    query += ' FROM ' + model.tableName;

    return makeQuery(query, opt, sort, limit);
};

exports.item = function(req, res){
    var sql = getSQLQuery(req.query, Item);

    doQuery(sql, function(err, items){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(items.length === 0 || !items[0]){
            res.send(404);
            return;
        }

        res.json({
            err: err,
            data: items
        });
    });
};

exports.channel = function(req, res){
    var sql = getSQLQuery(req.query, Channel);

    doQuery(sql, function(err, items){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(items.length === 0 || !items[0]){
            res.send(404);
            return;
        }

        res.json({
            err: err,
            data: items
        });
    });
};