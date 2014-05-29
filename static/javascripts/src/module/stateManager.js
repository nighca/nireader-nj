define(function(require, exports, module) {
    var formatUrl = require('../kit/url').format;
    var customEvent = require('../kit/customEvent');

    var StateManager = function(opt){
        this.handlers = {};

        this.init();
    };

    StateManager.prototype.init = function(){
        this.bindEvent();
    };

    StateManager.prototype.bindEvent = function(){
        var manager = this;

        var gotoUrl = function(url){
            url = formatUrl(url);

            if(history.pushState){
                manager.pushState({
                    url: url,
                    title: 'Loading'
                });
                manager.checkout();
            }else{
                location.href = url;
            }
        };

        $('body').delegate('[data-link-async]', 'click', function(e){

            var link = $(this);
            if(link.attr('disabled') || !link.attr('href')){
                return false;
            }

            if(!e.ctrlKey){
                e.preventDefault();
                gotoUrl(link.attr('href'));
            }else{
                // do nothing... just let it jump
            }
        });

        customEvent.on('goto', gotoUrl);
        customEvent.on('goback', function(e){
            history.back();
        });

        var onpopstate = window.onpopstate = function(e){
            if(window.history.state !== null){
                manager.checkout();
            }
        };

        // do checkout while page loaded (chrome trigger popstate automatically)
        //if(navigator.userAgent.toLowerCase().indexOf('chrome') < 0){
        // chrome fixed this bug
        if(true){
            setTimeout(function(){
                manager.checkout();
            }, 0);
        }
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