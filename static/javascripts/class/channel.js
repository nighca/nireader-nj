define(function(require, exports, module) {
	var render = require('../template/channel');

	var Channel = function(opt){
		this.data = opt.data;
        this.url = opt.url;
        this.title = opt.title;
        this.type = 'channel';
	};

	Channel.prototype.render = function(){
		var str;
		try{
			str = render(this.data);
		}catch(e){
			str = '';
		}
		return str;
	};
	Channel.prototype.bindEvent = function(){};

	module.exports = Channel;

});