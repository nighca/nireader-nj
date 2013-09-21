var Item = require('../model/item');

//get
exports.get = function(req, res){
    Item.select({id: req.params.iid}, function (err, items) {
        if(err){
            res.send(500, {err: err});
            return;
        }else if(items.length === 0 || !items[0]){
            res.send(404);
            return;
        }

        var item = items[0];
        if(req.get('isAjax')){
            res.json({
                err: err,
                data: item
            });
        }else{
            res.render('reader', {title: 'item'});
        }
    });
};