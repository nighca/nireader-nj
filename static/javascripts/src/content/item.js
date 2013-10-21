define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var URL = require('../kit/url');
    var eventList = require('../kit/eventList');
    var notice = require('../kit/notice').notice;
    var customEvent = require('../kit/customEvent');

    var genItemTitle = require('../template/item/title');
    var genItemInfo = require('../template/item/info');
    var genItemContent = require('../template/item/content');
    var genItemChannelTitle = require('../template/item/channelTitle');

    var pageTitle = $('title');

    var inSubscriptionFlag = '/my/';
    var inRecommendFlag = '/recommend/';

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
        var upButton = this.doms.upButton;
        var checkoutDelay = 300;

        var addEvent = this.eventList.add,
            removeEvent = this.eventList.remove;

        this.doms.content.find('a').each(function(i, a){
            a = $(a);
            if(!a.attr('data-link-async')){
                a.attr('target', '_blank');
            }
        });

        addEvent(upButton, 'click', function(e){
            e.preventDefault();

            upButton.animate({
                'marginTop': '8px'
            }, 100, function(){
                middleBlock.animate({
                    'scrollTop': 0
                }, 100, function(){
                    upButton.css({
                        'marginTop': 0
                    });
                });
            });
        });

        var _this = this;
        addEvent(middleBlock, 'scroll', function(e){
            removeEvent(middleBlock, 'mousewheel', topScroll);
            removeEvent(middleBlock, 'mousewheel', bottomScroll);

            var mb = middleBlock[0];
            var offsetTop = 40, offsetBottom = 60;
            var readPercent = mb.scrollTop / (mb.scrollHeight - mb.clientHeight);
            var top = readPercent * (mb.clientHeight - offsetTop - offsetBottom - upButton.height()) + offsetTop + 'px';
            var opacity = readPercent;
            upButton.text(Math.floor(readPercent * 100) + '%').css({
                'top': top,
                'opacity': opacity
            });
        });

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
                //removeEvent(middleBlock, 'mousewheel', topScroll);
                //removeEvent(middleBlock, 'mousewheel', bottomScroll);

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
        this.doms.upButton.remove();
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
            id: parseInt(URL.parse(_this.url).id, 10),
            inSubscription: _this.url.indexOf(inSubscriptionFlag) === 0,
            inRecommend: _this.url.indexOf(inRecommendFlag) === 0
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

        var upButton = document.createElement('div');
        upButton.className = 'up-button';
        _this.doms.wrapper.append(upButton);
        _this.doms.upButton = $(upButton);
    };

    Item.prototype.getItemInfo = function(callback){
        var _this = this;
        resource.get('item', {
            id: _this.data.id
        }, function(err, item){
            if(err){
                if(err.status == 404){
                    notice('走错地方了。', function(){
                        customEvent.trigger('goto', '/');
                    });
                }else{
                    LOG(err);
                }
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
        var genUrl = pagePath.channel;
        genUrl = this.data.inSubscription ? pagePath.myChannel : genUrl;
        genUrl = this.data.inRecommend ? pagePath.recommendChannel : genUrl;
        channel.pageUrl = genUrl(channel.id);

        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };

    Item.prototype.getNeighbourInfo = function(callback){
        var _this = this;
        resource.list('item', {
            source: _this.data.item.source
        }, null, function(err, items){
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
        var getItemUrl = pagePath.item;
        getItemUrl = this.data.inSubscription ? pagePath.myItem : getItemUrl;
        getItemUrl = this.data.inRecommend ? pagePath.recommendItem : getItemUrl;

        if(neighbours.prev){
            this.doms.leftLink
                .attr('href', getItemUrl(neighbours.prev.id))
                .attr('title', neighbours.prev.title)
                .show();
        }else{
            this.doms.leftLink
                .hide();
        }
        if(neighbours.next){
            this.doms.rightLink
                .attr('href', getItemUrl(neighbours.next.id))
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
    };

    Item.prototype.renderChannelInfo = function(data){
        this.doms.topLink.attr('href', data.channel.pageUrl);
        this.doms.topLink.attr('title', data.channel.title);
        this.doms.info.prepend(genItemChannelTitle(data));
    };

    module.exports = Item;
});