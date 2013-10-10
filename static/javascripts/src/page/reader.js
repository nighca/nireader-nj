define(function(require, exports, module) {
    var stateManager = require('../module/stateManager');
    var page = require('../module/page');
    var floater = require('../module/floater');

    var bind = function(){
        stateManager.on('checkout', function(info){
            page.checkout(info);
        });
    };

    //bind();

    module.exports = {
        name: 'reader',
        bind: bind
    };
});