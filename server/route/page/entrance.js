module.exports = function(req, res){
    if(req.session.uid){
        res.redirect('/');
    }else{
        res.render('entrance', {title: 'nireader'});
    }
};