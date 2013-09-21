exports.get = function(req, res){
    req.session = null;
    res.clearCookie('connect.sid');
    res.redirect('/');
};