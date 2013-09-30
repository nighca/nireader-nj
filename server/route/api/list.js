var makeQuery = require('../../lib/database').makeQuery;
var doQuery = require('../../lib/data').doQuery;
var Item = require('../../model/item');
var Channel = require('../../model/channel');
var Subscription = require('../../model/subscription');

var parseOpt = function(query, model){
    var opt;
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
    return opt;
};

var parseSort = function(query){
    var sort;
    if(query.sort && query.sort.order){
        sort = {
            order: decodeURI(query.sort.order),
            descrease: query.sort.descrease && query.sort.descrease !== 'false'
        };
    }
    return sort;
};

var parseLimit = function(query){
    var limit;
    if(query.limit){
        limit = query.limit;
    }
    return limit;
};

var parseFields = function(query){
    var fields;
    if(query.fields && query.fields.length){
        fields = [];
        for (var i = 0, l = query.fields.length; i < l; i++) {
            fields.push(decodeURI(query.fields[i]));
        };
    }
    return fields;
};

var parseQuery = function(query, model){
    return {
        opt: parseOpt(query, model),
        sort: parseSort(query),
        limit: parseLimit(query),
        fields: parseFields(query)
    };
};

var genSQLQuery = function(query, model){
    var params = parseQuery(query, model);

    var sql = 'SELECT';
    if(params.fields){
        for (var i = 0, l = params.fields.length; i < l; i++) {
            if(i === 0){
                sql += ' ';
            }else{
                sql += ', ';
            }
            sql += params.fields[i];
        }
    }else{
        sql += ' *';
    }
    sql += ' FROM ' + model.tableName;

    return makeQuery(sql, params.opt, params.sort, params.limit);
};

exports.item = function(req, res){
    var sql = genSQLQuery(req.query, Item);

    doQuery(sql, function(err, items){
        if(err){
            res.send(500, {err: err});
            return;
        }

        res.json({
            err: err,
            data: items
        });
    });
};

exports.channel = function(req, res){
    var sql = genSQLQuery(req.query, Channel);

    doQuery(sql, function(err, items){
        if(err){
            res.send(500, {err: err});
            return;
        }

        res.json({
            err: err,
            data: items
        });
    });
};

exports.subscription = function(req, res){
    var uid = req.session.uid;

    var opt;
    if(req.query.opt){
        opt = {};
        if(req.query.opt.id){
            opt.id = req.query.opt.id;
        }
        for(var name in Subscription.struct){
            if(Subscription.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
        for(var name in Channel.struct){
            if(Channel.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    var sort = parseSort(req.query);
    var limit = parseLimit(req.query);
    var fields = parseFields(req.query);

    var sql = 'SELECT';
    if(fields){
        for (var i = 0, l = fields.length; i < l; i++) {
            if(i === 0){
                sql += ' ';
            }else{
                sql += ', ';
            }
            sql += fields[i];
        }
    }else{
        sql += ' *';
    }
    sql +=
        ' FROM '+
        Channel.tableName +
        ', ' +
        Subscription.tableName;

    opt = opt || {};
    opt[Channel.tableName + '.id'] = {
        dbFormat: function(){
            return Subscription.tableName + '.subscribee';
        }
    };
    opt[Subscription.tableName + '.subscriber'] = uid;

    sql = makeQuery(sql, opt, sort, limit);

    doQuery(sql, function(err, subscriptions){
        if(err){
            res.send(500, {err: err});
            return;
        }

        res.json({
            err: err,
            data: subscriptions
        });
    });
};
