define(function(require, exports, module) {
    var createContent = require('./createContent');
    var resource = require('../kit/resource');
    var URL = require('../kit/url');

    var StateManager = function(opt){
        this.state = null

        this.init();
    }

    var createContentWithUrl = function(url, callback){
        url = URL.format(url);
        var type = URL.getType(url);
        if(!type){
            callback('Wrong url');
        }

        resource.get(url, function(err, resource){
            if(!err){
                var content = createContent({
                    url: url,
                    data: resource[0],
                    type: type,
                    title: 'test title'
                });
                callback(null, content);
            }else{
                callback(err);
            }
        });
    };

    StateManager.prototype.init = function(){
        var manager = this;

        manager.bindEvent();

        createContentWithUrl(location.href, function(err, content){
            if(!err){
                manager.checkout(content);
            }else{
                console.warn(err);
            }
        });
    };

    StateManager.prototype.pushState = function(state){
        state = state || this.state;
        var title = state.title;
        var url = state.url;
        $('title').text(title);
        history.pushState(state, title, url);
    };

    StateManager.prototype.render = function(callback){
        $('body').html(this.state.render());
        callback();
    };

    StateManager.prototype.preload = function(){
        $('[data-link-async]').each(function(i, link){
            link = $(link);
            var preload = link.attr('data-link-preload');
            var url = link.attr('href');
            if(preload == "true" && url){
            }
        });
    };

    StateManager.prototype.checkout = function(target, callback){
        var manager = this;

        if(!target){
            callback && callback();
            return;
        }

        manager.state = target;
        manager.render(function(){
            callback && callback();
            manager.preload();
        });
    };

    StateManager.prototype.bindEvent = function(){
        var manager = this;

        $('body').delegate('[data-link-async]', 'click', function(e){
            e.preventDefault();
            createContentWithUrl(url, function(err, content){
                manager.checkout(content, function(){
                    manager.pushState();
                });
            });
        });

        window.onpopstate = function(e){
            if(!e.state){
                return;
            }

            manager.checkout(createContent(e.state));
        };
    };

    module.exports = new StateManager();
});