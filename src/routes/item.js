var Item = require('../model/item');

//get
exports.get = function(req, res){
    Item.select({id: req.params.iid}, function (err, items) {
    	var item = items[0];
        if(err){
            res.send(500, {error: err});
            return;
        }else if(items.length === 0){
            res.send(404);
            return;
        }
        res.render('item', {title: 'item', item: item});
    });
};