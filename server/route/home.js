exports.get = function(req, res){
    if(req.session.uid){
        res.render('reader', {title: 'home'});
    }else{
        res.render('entrance', {title: 'home'});
    }  
};