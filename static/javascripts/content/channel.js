define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var URL = require('../kit/url');
    var eventList = require('../kit/eventList').create('content/channel');
    var addEvent = eventList.add;

    var genChannelTitle = require('../template/channel/title');
    var genChannelInfo = require('../template/channel/info');
    var genItemList = require('../template/channel/itemList');

    var Channel = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'channel';
    };

    Channel.prototype.init = function(){
        this.prepareInfo();
        this.getItemListByPage(1);
        this.getChannelInfo();
        this.getNeighbourInfo();

        this.bindEvent();
    };

    Channel.prototype.bindEvent = function(){};

    Channel.prototype.clean = function(){
        eventList.clean();
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
            id: parseInt(URL.parse(_this.url).id, 10)
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
                console.error(err || 'No such channel');
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
        resource.list('subscription', null, {
            from: 0
        }, function(err, channels){
            if(err || channels.length < 1){
                console.error(err || 'Get aside channel info fail.');
                return;
            }

            var pos = -1;
            for (var i = 0, l = channels.length; i < l; i++) {
                if(parseInt(channels[i].id, 10) === _this.data.id){
                    pos = i;
                    break;
                }
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
        if(neighbours.prev){
            this.doms.leftLink
                .attr('href', pagePath.channel(neighbours.prev.id))
                .attr('title', neighbours.prev.title)
                .show();
        }else{
            this.doms.leftLink
                .hide();
        }
        if(neighbours.next){
            this.doms.rightLink
                .attr('href', pagePath.channel(neighbours.next.id))
                .attr('title', neighbours.next.title)
                .show();
        }else{
            this.doms.rightLink
                .hide();
        }
    };

    Channel.prototype.dealItemList = function(items){
        this.data.items = items;
        this.renderItemList({
            items: items
        });
    };

    Channel.prototype.renderChannelInfo = function(data){
        this.doms.title.html(genChannelTitle(data));
        this.doms.info.html(genChannelInfo(data));
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
        addEvent(_this.doms.content.find('.item'), 'mouseenter', function(){
            if(timer){
                timer = clearTimeout(timer);
            }

            var $this = $(this);
            var iid = $this.attr('data-id');
            _this.doms.sideBlock.attr('data-iid', iid)
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
        addEvent(_this.doms.content, 'mouseleave', function(){
            timer = setTimeout(function(){
                _this.doms.sideBlock.hide();
            }, 200);
        });
    };

    module.exports = Channel;
});