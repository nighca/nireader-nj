module.exports = function(req, res){
	console.log('!!!!!!!!!!!', req.session);//----------------------
    if(req.session.uid){
        res.render('reader', {title: 'home'});
    }else{
        res.redirect('/welcome');
    }  
};