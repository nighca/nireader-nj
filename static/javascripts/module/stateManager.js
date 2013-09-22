define(function(require, exports, module) {

    var StateManager = function(opt){
        this.state = null;
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

            var url = formatUrl($(this).attr('href'));
            manager.checkout({
                url: url,
                title: 'Loading'
            });
        });

        window.onpopstate = function(e){content
            if(!e.state){
                return;
            }

            manager.checkout(e.state);
        };
    };

    StateManager.prototype.pushState = function(state){
        history.pushState(null, this.state.title, this.state.url);
    };

    StateManager.prototype.checkout = function(target, callback){
        var manager = this;

        manager.state = target;
        manager.pushState();

        this.trigger('checkout', manager.state);
    };

    StateManager.prototype.on = function(event, handler){
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(handler);
    };

    StateManager.prototype.trigger = function(event){
        var list = this.handlers[event],
            args = arguments.slice(1);
        for (var i = 0, l = list.length; i < l; i++) {
            try{
                list[i].apply(this, args);
            }catch(e){
                console.warn(e);
            }
        };
        this.handlers[event] = null;
    };    

    module.exports = new StateManager();
});