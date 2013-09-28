define(function(require, exports, module) {
    var stateManager = require('../module/stateManager');
    var page = require('../module/page');
    var floater = require('../module/floater');

    var customEvent = require('../kit/customEvent');

    stateManager.on('checkout', function(info){
        page.checkout(info);
    });

    customEvent.on('pageInfoUpdate', function(){
    	stateManager.checkout();
    });
});