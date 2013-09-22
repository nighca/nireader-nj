define(function(require, exports, module) {
	var stateManager = require('../module/stateManager');
	var page = require('../module/page');

    stateManager.on('checkout', function(state){
    	page.checkout();
    });
});