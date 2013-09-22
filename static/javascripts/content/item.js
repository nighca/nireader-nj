define(function(require, exports, module) {
	var tmpl = require('../template/item');

	var Item = function(opt){
		this.data = opt.data;
        this.url = opt.url;
        this.title = opt.title;
        this.type = 'item';
        this.render = template.compile(tmpl);
	};

	Item.prototype.bindEvent = function(){};

	module.exports = Item;

});