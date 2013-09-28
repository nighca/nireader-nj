var Item = require('../../model/item');

exports.get = function(req, res){
    var opt = {}, sort;
    if(req.query.opt){
        if(req.query.opt.id){
            opt.id = req.query.opt.id;
        }
        for(var name in Item.struct){
            if(Item.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    if(req.query.sort){
        sort = {
            order: req.query.sort.order ? decodeURI(req.query.sort.order) : null,
            descrease: req.query.sort.descrease
        };
    }

    //console.log(opt, sort);//-------------------------------

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
            data: items[0]
        });
    }, sort);
};