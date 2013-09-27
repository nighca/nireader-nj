module.exports = function(req, res){
    //req.session.uid = 1; //-------------------------------------
    if(req.session.uid){
        res.render('reader', {title: 'home'});
    }else{
        res.render('entrance', {title: 'home'});
    }  
};