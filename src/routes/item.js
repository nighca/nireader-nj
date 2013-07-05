var Item = require('../model/item');
var format = require('../lib/date').format;

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

            if(req.get('isAjax')){
                res.json({
                    error: err,
                    result: item
                });
            }else{
                item.date = format(item.pubDate);
                res.render('item', {title: item.title, item: item});
            }
        });
};