define(function(require, exports, module){
	var cookie = require('./cookie');

	var identityKey = 'WhoAmI';

	var isLogin = function(callback){
		callback && callback(!!cookie.get(identityKey));
	};

	var getUserinfo = function(callback){
	};

	module.exports = {
		isLogin: isLogin
	};
});