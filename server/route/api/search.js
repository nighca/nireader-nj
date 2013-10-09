var makeQuery = require('../../lib/database').makeQuery;
var doQuery = require('../../lib/data').doQuery;

var Item = require('../../model/item');
var Channel = require('../../model/channel');
var Subscription = require('../../model/subscription');

var parseKeywords = function(query){
    var keywords;
    if(query.keywords && query.keywords.length){
        keywords = [];
        for (var i = 0, l = query.keywords.length; i < l; i++) {
            keywords.push(decodeURI(query.keywords[i]));
        }
    }
    return keywords;
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
        }
    }
    return fields;
};

var parseQuery = function(query, model){
    return {
        keywords: parseKeywords(query),
        sort: parseSort(query),
        limit: parseLimit(query),
        fields: parseFields(query)
    };
};

var genSQLQuery = function(query, model, searchAreas){
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

    return makeQuery(sql, {
        names: searchAreas,
        keywords: params.keywords
    }, params.sort, params.limit, true);
};

exports.channel = function (req, res) {
    if(!(req.query.keywords && req.query.keywords.length)){
        res.send(500, {
            err: 'missing keywords.'
        });
        return;
    }

    var sql = genSQLQuery(req.query, Channel, ['title', 'link', 'source', 'description']);

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