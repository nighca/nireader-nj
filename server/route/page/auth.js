module.exports = function(req, res){
    res.render('auth', {title: 'nireader', type: req.params.type});
};