/*
 * channel ops.
 */
var Channel = require('../model/channel');

exports.get = function(req, res){
    //res.send('get!');
    Channel.select({}, function (err, results) {
        console.log(err, results);
        res.json({
            err: err,
            data: results
        });
    });
};

exports.add = function(req, res){
    res.send('add!');
};