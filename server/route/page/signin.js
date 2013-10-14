module.exports = function(req, res){
    if(req.session.uid){
        res.redirect('/');
        return;
    }
    res.render('signin', {title: 'nireader', target:req.query.target});
};
