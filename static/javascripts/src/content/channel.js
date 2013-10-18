define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var URL = require('../kit/url');
    var eventList = require('../kit/eventList');
    var notice = require('../kit/notice').notice;
    var customEvent = require('../kit/customEvent');

    var userinfo = require('../kit/userinfo');

    var genChannelTitle = require('../template/channel/title');
    var genChannelInfo = require('../template/channel/info');
    var genItemList = require('../template/channel/itemList');

    var pageTitle = $('title');

    var inSubscriptionFlag = '/my/';

    var Channel = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        this.eventList = eventList.create('content/channel');

        this.type = 'channel';
    };

    Channel.prototype.init = function(){
        this.prepareInfo();
        this.getItemListByPage(1);
        this.getChannelInfo();

        var _this = this;
        userinfo.isLogin(function(isIn){
            if(isIn){
                _this.getNeighbourInfo();
            }else{
                _this.dealNoUserinfo();
            }
        });

        this.bindEvent();
    };

    Channel.prototype.bindEvent = function(){
    };

    Channel.prototype.clean = function(){
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.sideContent.html('');
        this.doms.sideBlock.clearQueue().stop().hide();
        this.doms.leftLink.attr('href', '');
        this.doms.rightLink.attr('href', '');
        this.doms.topLink.attr('href', '');
    };

    Channel.prototype.prepareInfo = function(){
        var _this = this;

        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10),
            inSubscription: _this.url.indexOf(inSubscriptionFlag) === 0
        };

        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find('#middle-block'),
            title: _this.wrapper.find('#title'),
            info: _this.wrapper.find('#info'),
            content: _this.wrapper.find('#content'),
            sideBlock: _this.wrapper.find('#side-block'),
            sideContent: _this.wrapper.find('#side-content'),
            leftLink: _this.wrapper.find('#left-link'),
            rightLink: _this.wrapper.find('#right-link'),
            topLink: _this.wrapper.find('#top-link')
        };

        _this.getItemListByPage = resource.makeList('item', {
            source: _this.data.id
        }, function(err, items){
            if(err){
                console.error(err);
                return;
            }
            _this.dealItemList(items);
        });
    };

    Channel.prototype.getChannelInfo = function(){
        var _this = this;
        resource.get('channel', {
            id: _this.data.id
        }, function(err, channel){
            if(err){
                if(err.status == 404){
                    notice('走错地方了', function(){
                        customEvent.trigger('goto', '/');
                    });
                }else{
                    LOG(err);
                }
                return;
            }
            _this.dealChannelInfo(channel);
        });
    };

    Channel.prototype.dealChannelInfo = function(channel){
        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };

    Channel.prototype.getNeighbourInfo = function(){
        var _this = this;

        var errorInfo = '不知道这是哪';

        var listName = _this.data.inSubscription ? 'subscription' : 'channel';

        resource.list(listName, null, null, function(err, channels){
            if(err || channels.length < 1){
                notice(errorInfo);
                LOG(err || errorInfo);
                return;
            }

            var pos = -1;
            for (var i = 0, l = channels.length; i < l; i++) {
                if(parseInt(channels[i].id, 10) === _this.data.id){
                    pos = i;
                    break;
                }
            }

            if(pos === -1){
                if(_this.data.inSubscription){
                    customEvent.trigger('goto', _this.url.slice(inSubscriptionFlag.length - 1));
                }else{
                    notice(errorInfo, function(){
                        customEvent.trigger('goto', '/');
                    });
                }
                return;
            }

            _this.dealNeighbourInfo({
                prev: channels[pos-1],
                next: channels[pos+1]
            });
        });
    };
    Channel.prototype.dealNeighbourInfo = function(neighbours){
        this.doms.topLink
            .attr('href', pagePath.home)
            .attr('title', 'Home');
        var getChannelUrl = this.data.inSubscription ? pagePath.myChannel : pagePath.channel;
        if(neighbours.prev){
            this.doms.leftLink
                .attr('href', getChannelUrl(neighbours.prev.id))
                .attr('title', neighbours.prev.title)
                .show();
        }else{
            this.doms.leftLink
                .hide();
        }
        if(neighbours.next){
            this.doms.rightLink
                .attr('href', getChannelUrl(neighbours.next.id))
                .attr('title', neighbours.next.title)
                .show();
        }else{
            this.doms.rightLink
                .hide();
        }
    };

    Channel.prototype.dealNoUserinfo = function(){
        this.doms.topLink
            .attr('href', pagePath.home)
            .attr('title', 'Home');
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };

    Channel.prototype.dealItemList = function(items){
        var getItemUrl = this.data.inSubscription ? pagePath.myItem : pagePath.item;
        items.map(function(item){
            item.pageUrl = getItemUrl(item.id);
            return item;
        });
        this.data.items = items;
        this.renderItemList({
            items: items
        });
    };

    Channel.prototype.renderChannelInfo = function(data){
        this.doms.title.html(genChannelTitle(data));
        this.doms.info.html(genChannelInfo(data));
        pageTitle.text(data.channel.title);
    };

    Channel.prototype.sideBlockLoading = function(){
        this.doms.sideBlock.addClass('loading');
    };

    Channel.prototype.sideBlockLoad = function(cnt){
        this.doms.sideBlock.removeClass('loading');
        this.doms.sideContent.html(cnt);
    };

    Channel.prototype.sideBlockGoto = function(li){
        var top = li.offset().top + this.doms.middleBlock.scrollTop();
        var originTop = parseInt(this.doms.sideBlock.css('top'), 10);
        this.doms.sideBlock
            .stop()
            .clearQueue()
            .show()
            .delay(200)
            .animate({
                'top': (top * 6 - originTop)/5
            }, 100)
            .animate({
                'top': top
            }, 50);
    };

    Channel.prototype.renderItemList = function(data){
        var _this = this;
        _this.doms.content.html(genItemList(data));
        var timer;
        this.eventList.add(_this.doms.content.find('.item'), 'mouseenter', function(){
            if(timer){
                timer = clearTimeout(timer);
            }

            var $this = $(this);
            var iid = parseInt($this.attr('data-id'), 10);
            _this.doms.sideBlock.attr('data-iid', iid);
            _this.sideBlockGoto($this);
            _this.sideBlockLoading();

            resource.get('item', {
                id: iid
            }, function(err, item){
                if(_this.doms.sideBlock.attr('data-iid') != iid){
                    return;
                }
                if(err){
                    _this.sideBlockLoad('Get item info failed.');
                    return;
                }
                _this.sideBlockLoad(item.content);
            });
        });
        this.eventList.add(_this.doms.content, 'mouseleave', function(){
            timer = setTimeout(function(){
                _this.doms.sideBlock.hide();
            }, 200);
        });
    };

    module.exports = Channel;
});