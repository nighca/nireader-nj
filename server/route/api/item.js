var Item = require('../../model/item');

exports.get = function(req, res){
    var opt = {};
    if(req.query.id){
        opt.id = req.query.id;
    }
    for(var name in Item.struct){
        if(Item.struct.hasOwnProperty(name) && req.query[name] !== null && req.query[name] !== undefined){
            opt[name] = decodeURI(req.query[name]);
        }
    }
    var sort = req.query.ORDER ? {
        order: decodeURI(req.query.ORDER),
        descrease: req.query.DESCREASE
    } : null;

    console.log(opt, sort);//-------------------------------

    Item.select(opt, function(err, items){
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
    }, sort);
};