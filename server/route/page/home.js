module.exports = function(req, res){
    if(req.session.uid){
        res.render('reader', {title: 'home'});
    }else{
        res.redirect('/welcome');
    }  
};