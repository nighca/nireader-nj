define(function(require, exports, module){
	var createContent = require('./createContent');

	var page = {
		wrapper: $('body');
	}

	page.getUrl = function(){
		this.url = URL.format(location.href);
	};

	page.initContent = function(){
		this.content = createContent({
			url: this.url,
			wrapper: this.wrapper
		});
		this.content.init();
		this.content.bindEvent();
	};

	page.init = function(){
		this.getUrl();
		thus.initContent();
	};

	page.clean = function(){
		this.content.destroy();
		this.wrapper.html('');
	};

	page.checkout = function(){
		this.clean();
		this.init();
	};

	module.exports = page;
});