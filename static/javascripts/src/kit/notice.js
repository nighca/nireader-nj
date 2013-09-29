define(function(require, exports, module){
    module.exports = function(word){
    	if(typeof word !== 'string'){
    		word = JSON.stringfy(word);
    	}
        alert(word);
    };
});
