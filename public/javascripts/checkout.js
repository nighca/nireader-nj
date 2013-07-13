var leftLink = $('#left-link');
var rightLink = $('#right-link');
var itemTitle = $('#item-title');
var itemInfo = $('#item-info');
var itemDate = $('#item-date');
var itemLink = $('#item-link');
var itemContent = $('#item-content');

var state = {};
var pushState = function(s){
    s = s || state;
    var title = s.curr ? s.curr.title : '>_<';
    var url = s.curr ? s.curr.id+"" : '';
    //console.log('push: ', title, url);//-------------------------
    console.log(s);//---------------------------------------
    history.pushState(s, title, url);
};
var replaceState = function(s){
    s = s || state;
    var title = s.curr ? s.curr.title : '>_<';
    var url = s.curr ? s.curr.id+"" : '';
    history.replaceState(s, title, url);
};

var itemManager = (function(){
    var items = {};
    return {
        get: function(item, callback){
            if(!item){
                return;
            }
            if(items[item.id]){
                callback && callback(null, items[item.id]);
                return;
            }
            getData('/channel/' + item.source + '/item/' + item.id, function(err, item){
                if(!err){
                    item.pubDate = new Date(item.pubDate);
                    items[item.id] = item;
                }
                callback && callback(err, item);
            });
        }
    };
})();

var getItem = itemManager.get;

var init = function(){
    if(!state.cid){
        state.cid = parseInt(getFromPathname('channel'), 10);
    }
    if(!state.iid){
        state.iid = parseInt(getFromPathname('item'), 10);
    }
    getData({cid: state.cid}, '/list/item', function (err, items) {
        if(err){
            dealError('Get item list: ', err);
            return;
        }

        items.forEach(function(item, i){
            if(item.id === state.iid){
                if(items[i-1]){
                    state.prev = items[i-1];
                    state.prev.pos = i-1;
                }else{
                    state.prev = null;
                }
                
                state.curr = item;
                state.curr.pos = i;

                if(items[i+1]){
                    state.next = items[i+1];
                    state.next.pos = i+1;
                }else{
                    state.next = null;
                }
            }
        });

        var adjustLink = function(obj, ele){
            if(obj){
                ele.attr('href', '/channel/'+state.cid+'/item/'+obj.id).show();
            }else{
                ele.hide();
            }
        };
        adjustLink(state.prev, leftLink);
        adjustLink(state.next, rightLink);

        getItem(state.prev, function(err, item){
            if(err){
                dealError('Get item: ', state.prev.title, err);
                return;
            }
            item.pos = state.prev.pos;
            state.prev = item;
        });
        getItem(state.next, function(err, item){
            if(err){
                dealError('Get item: ', state.next.title, err);
                return;
            }
            item.pos = state.next.pos;
            state.next = item;
        });
    });
};

$(function () {
    init();

    itemTitle.doCheckout = function(cnt, direction){
        direction = direction || 'left';
        switch(direction){
            case 'left': this.animate({
                    left: '100%',
                    opacity: '0'
                }, 300, function(){
                    $(this).text(cnt).animate({
                        left: '-100%'
                    }, 0).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            case 'right': this.animate({
                    left: '-100%',
                    opacity: '0'
                }, 300, function(){
                    $(this).text(cnt).animate({
                        left: '100%'
                    }, 0).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            default: break;
        }
    };

    itemInfo.doCheckout = function(cnt, direction){
        direction = direction || 'left';
        switch(direction){
            case 'left': this.delay(40).animate({
                    left: '100%',
                    opacity: '0'
                }, 300, function(){
                    itemDate.text(cnt.date);
                    itemLink.attr('href',cnt.link);
                    $(this).animate({
                        left: '-100%'
                    }, 0).delay(40).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            case 'right': this.delay(40).animate({
                    left: '-100%',
                    opacity: '0'
                }, 300, function(){
                    itemDate.text(cnt.date);
                    itemLink.attr('href',cnt.link);
                    $(this).animate({
                        left: '100%'
                    }, 0).delay(40).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            default: break;
        }
    };

    itemContent.doCheckout = function(cnt, direction){
        direction = direction || 'left';
        switch(direction){
            case 'left': this.delay(80).animate({
                    left: '100%',
                    opacity: '0'
                }, 300, function(){
                    $('.center-block').scrollTop(0);
                    $(this).html(cnt).animate({
                        left: '-100%'
                    }, 0).delay(80).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            case 'right': this.delay(80).animate({
                    left: '-100%',
                    opacity: '0'
                }, 300, function(){
                    $('.center-block').scrollTop(0);
                    $(this).html(cnt).animate({
                        left: '100%'
                    }, 0).delay(80).animate({
                        left: '0',
                        opacity: '1'
                    }, 300);
                });
                break;
            default: break;
        }
    };

    var showItem = function(item, callback){
        var direction = state.curr.pos > item.pos ? 'left' : 'right';
        //console.log(state.curr.pos, item.pos);//----------------------------

        $('title').text(item.title);

        itemTitle.doCheckout(item.title, direction);
        itemInfo.doCheckout({
            date: item.pubDate.toLocaleTimeString() + ' ' + item.pubDate.toLocaleDateString(),
            link: item.link
        }, direction);

        if(item.content){
            itemContent.doCheckout(item.content, direction);
            callback && callback();
        }else{
            getItem(item, function(err, item){
                if(err){
                    dealError('Get item: ', item.title, err);
                    callback && callback();
                    return;
                }
                itemContent.doCheckout(item.content, direction);
                //itemContent.html(item.content);
                callback && callback();
            });
        }
    };

    var checkout = function(item, callback){
        if(!item){
            callback && callback();
            return;
        }

        showItem(item, callback);

        state.iid = item.id;
        state.curr = item;
        init();
        pushState();
    };

    window.onpopstate = function(e){
        if(!e.state){
            return;
        }
        console.log(e.state);//------------------------------------
        showItem(e.state.curr);
        state = e.state;
        init();
    };

    leftLink.on('click', function(){
        checkout(state.prev);
    });

    rightLink.on('click', function(){
        checkout(state.next);
    });
    
});