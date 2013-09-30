define(function(require, exports, module) {
    var stateManager = require('../module/stateManager');
    var page = require('../module/page');
    var floater = require('../module/floater');

    var customEvent = require('../kit/customEvent');

    var bind = function(){
        stateManager.on('checkout', function(info){
            page.checkout(info);
        });

        customEvent.on('userInfoUpdate', function(){
            if(page.content && page.content.type === 'home'){
                stateManager.checkout();
            }
        });
    };

    //bind();

    module.exports = {
        name: 'reader',
        bind: bind
    };
});