function Content (opt) {
    this.obj = opt.obj;
    this.type = opt.type;
}

Content.prototype.getTitle = function() {
    return this.obj.title;
};

Content.prototype.getUrl = function() {
    return this.obj.url;
};

Content.prototype.render = function() {
    this.obj.render.apply(this.obj, arguments);
};

Content.prototype.getPrev = function() {
    this.obj.getPrev.apply(this.obj, arguments);
};

Content.prototype.getNext = function() {
    this.obj.getNext.apply(this.obj, arguments);
};

var getContentWithUrl = function(url, callback){
    var itemUrlPattern = /\/channel\/[\d\w]+\/item\/[\d\w]+/;
    var channelUrlPattern = /\/channel\/[\d\w]+/;

    if(itemUrlPattern.test(url)){
        getItem(url, function(err, item){
            if(err){
                callback && callback(err);
                return;
            }
            callback(null, new Item(item, url));
        });
    }else if(channelUrlPattern.test(url)){
        getChannel(url, function(err, channel){
            if(err){
                callback && callback(err);
                return;
            }
            callback(null, new Channel(channel, url));
        });
    }
};

function Item (item, url) {
    for(var name in item){
        this[name] = item[name];
    }

    this.pubDate = new Date(this.pubDate);
    this.date = this.pubDate.toLocaleTimeString() + ' - ' + this.pubDate.toLocaleDateString();

    if(url){
        this.url = url;
    }

    return new Content({
        obj: this,
        type: 'item'
    });
}

Item.prototype.render = function(wrapper, callback){
    var curr = this, prev, next;
    var cid = getFromPathname('channel', curr.url);

    var titleBlock = wrapper.find('#item-title');
    var dateBlock = wrapper.find('#item-date');
    var linkBlock = wrapper.find('#item-link');
    var contentBlock = wrapper.find('#item-content');

    var prevLink = wrapper.find('#left-link');
    var nextLink = wrapper.find('#right-link');
    var parentLink = wrapper.find('#top-link');

    titleBlock.text(curr.title || 'no title');
    dateBlock.text(curr.date || 'no date');
    linkBlock.attr('href', curr.link);
    contentBlock.html(curr.content || 'no content');

    parentLink.attr('href', curr.url.replace(/\/channel\/[\w\d\_]+\/item\/[\w\d\_]+$/, '/channel/'+curr.source));

    getData({cid: cid}, '/list/item', function (err, items) {
        if(err){
            dealError('Get Item list: ', err);
            callback && callback(err);
            return;
        }

        items.forEach(function(item, i){
            if(item.id === curr.id){
                if(items[i-1]){
                    prev = items[i-1];
                }
                if(items[i+1]){
                    next = items[i+1];
                }
            }
        });

        var renderLink = function(obj, link){
            if(obj){
                link.attr('href', obj.id).show();
            }else{
                link.hide();
            }
        };
        renderLink(prev, prevLink);
        renderLink(next, nextLink);
        callback && callback(err);
    });
};

function Channel (channel, url) {
    for(var name in channel){
        this[name] = channel[name];
    }

    this.pubDate = new Date(this.pubDate);
    this.date = this.pubDate.toLocaleTimeString() + ' - ' + this.pubDate.toLocaleDateString();

    if(url){
        this.url = url;
    }

    return new Content({
        obj: this,
        type: 'channel'
    });
}

Channel.prototype.render = function(wrapper, callback){
    var curr = this, prev, next;
    var uid = getFromPathname('user', curr.url);

    var titleBlock = wrapper.find('#item-title');
    var dateBlock = wrapper.find('#item-date');
    var linkBlock = wrapper.find('#item-link');
    var contentBlock = wrapper.find('#item-content');

    var prevLink = wrapper.find('#left-link');
    var nextLink = wrapper.find('#right-link');
    var parentLink = wrapper.find('#top-link');

    titleBlock.text(curr.title || 'no title');
    dateBlock.text(curr.date || 'no date');
    linkBlock.attr('href', curr.link);
    curr.content = template.render('channel-template', {
        channel: curr,
        list: curr.items
    });
    contentBlock.html(curr.content || 'no content');

    parentLink.attr('href', '/');
    parentLink.on('click', function(){
        location.href = $(this).attr('href');
    });

    getData({uid: uid}, '/list/channel', function (err, channels) {
        if(err){
            dealError('Get Item list: ', err);
            callback && callback(err);
            return;
        }

        channels.forEach(function(channel, i){
            if(channel.id === curr.id){
                if(channels[i-1]){
                    prev = channels[i-1];
                }
                if(channels[i+1]){
                    next = channels[i+1];
                }
            }
        });

        var renderLink = function(obj, link){
            if(obj){
                link.attr('href', obj.id).show();
            }else{
                link.hide();
            }
        };
        renderLink(prev, prevLink);
        renderLink(next, nextLink);
        callback && callback(err);
    });
};