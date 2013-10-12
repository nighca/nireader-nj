module.exports = function cleanSession(options){
    return function cleanSession(req, res, next) {
        res.on('header', function(){


            // clean session if it is empty
            // so that client cookie set empty while no session

            var isEmpty = true;
            for(var name in req.session){
                if(req.session.hasOwnProperty(name) && name != 'cookie'){
                    isEmpty = false;
                    break;
                }
            }

            if(isEmpty){
                req.session = null;
            }
        });
        next();
    };
};
