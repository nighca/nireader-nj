var log = function (obj) {
    if(typeof obj === 'object'){
        for(var name in obj){
            if(obj.hasOwnProperty(name)){
                console.log(name, typeof obj[name], " : ");
                log(obj[name]);
            }
        }
    }else{
        console.log(obj);
    }
};

exports = module.exports = log;