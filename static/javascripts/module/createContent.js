define(function(require, exports, module){
	var URL = require('../kit/url');

	var Contents = {
		'channel': require('../content/channel'),
		'item': require('../content/item')
	};

	var createContent = function(opt){
		var type = opt.type || URL.getType(opt.url);
		var Content = Contents[type];
		return Content ? new Content(opt) : null;
	};

	module.exports = createContent;
});