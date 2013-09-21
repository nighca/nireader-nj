define(function(require, exports, module){
	var Contents = {
		'channel': require('../class/channel'),
		'item': require('../class/item')
	};

	var createContent = function(opt){
		var Content = Contents[opt.type];
		return Content ? new Content(opt) : null;
	};

	module.exports = createContent;
});