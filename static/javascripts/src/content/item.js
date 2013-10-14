define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var URL = require('../kit/url');
    var eventList = require('../kit/eventList');

    var genItemTitle = require('../template/item/title');
    var genItemInfo = require('../template/item/info');
    var genItemContent = require('../template/item/content');
    var genItemChannelTitle = require('../template/item/channelTitle');

    var pageTitle = $('title');

    var testScroll = require('../kit/testScroll');
    var testBottom = testScroll.bottom;
    var testTop = testScroll.top;

    var Item = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;

        this.eventList = eventList.create('content/item');

        this.type = 'item';
    };

    Item.prototype.init = function(){
        var _this = this;

        _this.prepareInfo();
        _this.getItemInfo(function(){
            _this.getChannelInfo();
            _this.getNeighbourInfo(function(){
                _this.preloadNeighbours();
            });
        });

        _this.bindEvent();
    };

    Item.prototype.bindEvent = function(){
        var data = this.data;
        var middleBlock = this.doms.middleBlock;
        var leftLink = this.doms.leftLink;
        var rightLink = this.doms.rightLink;
        var checkoutDelay = 300;

        var addEvent = this.eventList.add,
            removeEvent = this.eventList.remove;

        var topScroll = function(e, delta, deltaX, deltaY){
            if(deltaY > 0){
                (leftLink.css('display') !== 'none') && leftLink.click();
            }
        };
        var bottomScroll = function(e, delta, deltaX, deltaY){
            if(deltaY < 0){
                (rightLink.css('display') !== 'none') && rightLink.click();
            }
        };

        var initScroll = true;

        setTimeout(function(){
            addEvent(middleBlock, 'mousewheel', function(e, delta, deltaX, deltaY){
                removeEvent(middleBlock, 'mousewheel', topScroll);
                removeEvent(middleBlock, 'mousewheel', bottomScroll);

                if(initScroll){
                    initScroll = false;
                    return;
                }

                if(deltaY > 0 && testTop(middleBlock)){
                    data.timer1 = data.timer1 || setTimeout(function(){
                        addEvent(middleBlock, 'mousewheel', topScroll);
                        data.timer1 = null;
                    }, checkoutDelay);
                }

                if(deltaY < 0 && testBottom(middleBlock)){
                    data.timer2 = data.timer2 || setTimeout(function(){
                        addEvent(middleBlock, 'mousewheel', bottomScroll);
                        data.timer2 = null;
                    }, checkoutDelay);
                }
            });
        }, 200);
    };

    Item.prototype.clean = function(){
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        clearTimeout(this.data.timer);
        clearTimeout(this.data.timer1);
        clearTimeout(this.data.timer2);
        this.doms.leftLink.attr('href', '');
        this.doms.rightLink.attr('href', '');
        this.doms.topLink.attr('href', '');
    };

    Item.prototype.prepareInfo = function(){
        var _this = this;

        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10)
        };

        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find('#middle-block'),
            title: _this.wrapper.find('#title'),
            info: _this.wrapper.find('#info'),
            content: _this.wrapper.find('#content'),
            leftLink: _this.wrapper.find('#left-link'),
            rightLink: _this.wrapper.find('#right-link'),
            topLink: _this.wrapper.find('#top-link')
        };
    };

    Item.prototype.getItemInfo = function(callback){
        var _this = this;
        resource.get('item', {
            id: _this.data.id
        }, function(err, item){
            if(err){
                console.error(err || 'No such item');
                return;
            }
            _this.dealItemInfo(item);
            callback && callback();
        });
    };

    Item.prototype.getChannelInfo = function(){
        var _this = this;
        resource.get('channel', {
            id: _this.data.item.source
        }, function(err, channel){
            if(err){
                console.error(err || 'Can not get channel');
                return;
            }
            _this.dealChannelInfo(channel);
        });
    };

    // 预读取相邻文章内容到缓存中
    Item.prototype.preloadNeighbours = function(){
        var neighbour;
        if(neighbour = this.data.neighbours.prev){
            resource.get('item', {
                id: neighbour.id
            });
        }
        if(neighbour = this.data.neighbours.next){
            resource.get('item', {
                id: neighbour.id
            });
        }
    };

    Item.prototype.dealItemInfo = function(item){
        this.data.item = item;
        this.renderItemInfo({
            item: item
        });
    };

    Item.prototype.dealChannelInfo = function(channel){
        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };

    Item.prototype.getNeighbourInfo = function(callback){
        var _this = this;
        resource.list('item', {
            source: _this.data.item.source
        }, {
            from: 0
        }, function(err, items){
            if(err || items.length < 1){
                console.error(err || 'Get aside item info fail.');
                return;
            }

            var pos = -1;
            for (var i = 0, l = items.length; i < l; i++) {
                if(parseInt(items[i].id, 10) === _this.data.id){
                    pos = i;
                    break;
                }
            }

            _this.dealNeighbourInfo({
                prev: items[pos-1],
                next: items[pos+1]
            });

            callback && callback();
        });
    };
    Item.prototype.dealNeighbourInfo = function(neighbours){
        this.data.neighbours = neighbours;
        if(neighbours.prev){
            this.doms.leftLink
                .attr('href', pagePath.item(neighbours.prev.id))
                .attr('title', neighbours.prev.title)
                .show();
        }else{
            this.doms.leftLink
                .hide();
        }
        if(neighbours.next){
            this.doms.rightLink
                .attr('href', pagePath.item(neighbours.next.id))
                .attr('title', neighbours.next.title)
                .show();
        }else{
            this.doms.rightLink
                .hide();
        }
    };

    Item.prototype.renderItemInfo = function(data){
        pageTitle.text(data.item.title);
        this.doms.title.html(genItemTitle(data));
        this.doms.info.html(genItemInfo(data));
        this.doms.content.html(genItemContent(data));
        this.doms.topLink.attr('href', pagePath.channel(data.item.source));
    };

    Item.prototype.renderChannelInfo = function(data){
        this.doms.topLink.attr('title', data.channel.title);
        this.doms.info.prepend(genItemChannelTitle(data));
    };

    module.exports = Item;
});