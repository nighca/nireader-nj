var Item = require('../model/item');

//get
exports.get = function(req, res){
    Item.select({id: req.params.iid}, function (err, items) {
    	var item = items[0];
        var status = 200;
        if(err){
            status = 500;
        }else if(items.length === 0){
            status = 404;
        }
        //res.json(status, item);
        res.render('item', {title: 'item', item: item});
    });
};