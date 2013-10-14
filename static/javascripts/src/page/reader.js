define(function(require, exports, module) {
    var stateManager = require('../module/stateManager');
    var page = require('../module/page');
    var floater = require('../module/floater');

    var init = function(){
        stateManager.on('checkout', function(info){
            page.checkout(info);
        });
    };

    module.exports = {
        name: 'reader',
        init: init
    };
});