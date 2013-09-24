define(function(require, exports, module) {

	var Item = function(opt){
		this.data = opt.data;
        this.url = opt.url;
        this.title = opt.title;
        this.type = 'item';
	};

	Item.prototype.bindEvent = function(){};

	module.exports = Item;

});