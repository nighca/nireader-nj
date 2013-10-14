module.exports = function(req, res){
    if(req.session.uid){
        res.render('reader', {title: 'nireader'});
    }else{
        res.redirect('/welcome');
    }
};