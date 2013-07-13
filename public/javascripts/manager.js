function StateManager(opt){
    this.state = {
        curr: opt.obj
    };
    this.wrapper = opt.wrapper;

    this.init();
}

StateManager.prototype.init = function() {
    var manager = this;

    window.onpopstate = function(e){
        if(!e.state){
            return;
        }
        manager.checkout(e.state.curr);
    };

    manager.bindEvent();

    manager.checkout(this.state.curr);
};

StateManager.prototype.pushState = function(state){
    state = state || this.state;
    var title = state.curr.getTitle();
    var url = state.curr.getUrl();
    $('title').text(title);
    history.pushState(state, title, url);
};

StateManager.prototype.render = function(callback){
    this.state.curr.render(this.wrapper, callback);
};

StateManager.prototype.preload = function(){
    $('[data-link-async]').each(function(i, link){
        link = $(link);
        var preload = link.attr('data-link-preload');
        var url = link.attr('href');
        if(preload == "true" && url){
            getResource(url);
        }
    });
};

StateManager.prototype.checkout = function(target, callback){
    var manager = this;

    if(!target){
        callback && callback();
        return;
    }

    manager.state.curr = target;
    manager.render(function(){
        callback && callback();
        manager.preload();
    });
};

StateManager.prototype.bindEvent = function(){
    var manager = this;
    $('body').delegate('[data-link-async]', 'click', function(e){
        e.preventDefault();
        var url = formatUrl($(this).attr('href'));
        getContentWithUrl(url, function(err, content){
            manager.checkout(content, function(){
                manager.pushState();
            });
        });
    });
};