define(function(require, exports, module) {
    var formatUrl = require('../kit/url').format;

    var StateManager = function(opt){
        this.handlers = {};

        this.init();
    }

    StateManager.prototype.init = function(){
        this.bindEvent();
    };

    StateManager.prototype.bindEvent = function(){
        var manager = this;

        $('body').delegate('[data-link-async]', 'click', function(e){
            e.preventDefault();

            var link = $(this);
            if(link.attr('disabled')){
                return false;
            }

            var url = formatUrl(link.attr('href'));
            manager.pushState({
                url: url,
                title: 'Loading'
            });
            manager.checkout();
        });

        window.onpopstate = function(e){
            manager.checkout();
        };
    };

    StateManager.prototype.pushState = function(state){
        history.pushState(state, state.title, state.url);
    };

    StateManager.prototype.checkout = function(target, callback){
        var manager = this;

        this.trigger('checkout');
    };

    StateManager.prototype.on = function(event, handler){
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(handler);
    };

    StateManager.prototype.trigger = function(event){
        var list = this.handlers[event],
            args = Array.prototype.slice.call(arguments, 1);
        if(list){
            for (var i = 0, l = list.length; i < l; i++) {
                try{
                    list[i].apply(this, args);
                }catch(e){
                    console.warn(e);
                    console.log(e.stack);
                }
            }
        }
    };    

    module.exports = new StateManager();
});