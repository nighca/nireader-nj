module.exports = function(req, res){
    if(req.session.uid){
        res.redirect('/');
        return;
    }
    res.render('signin', {title: 'signin', target:req.query.target});
};
