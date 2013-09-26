define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var URL = require('../kit/url');

    var makeChannelTitle = require('../template/channel/title');
    var makeChannelInfo = require('../template/channel/info');
    var makeItemList = require('../template/channel/itemList');

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
    };

    Channel.prototype.bindEvent = function(){};

    Channel.prototype.clean = function(){
        this.doms.content.html('');
    };

    Channel.prototype.prepareInfo = function(){
        var _this = this;

        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10)
        };

        _this.doms = {
            wrapper: _this.wrapper,
            title: _this.wrapper.find('#title'),
            info: _this.wrapper.find('#info'),
            content: _this.wrapper.find('#content'),
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
        }, function(err, channels){
            if(err || channels.length < 1){
                console.error(err || 'No such channel');
                return;
            }
            _this.dealChannelInfo(channels[0]);
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
        resource.list('channel', null, {
            from: _this.data.id - 2,
            num: 3
        }, function(err, channels){
            if(err || channels.length < 1){
                console.error(err || 'Get aside channel info fail.');
                return;
            }

            var pos = 1;
            for (var i = 0, l = channels.length; i < l; i++) {
                if(parseInt(channels[i].id, 10) === _this.data.id){
                    pos = i;
                    break;
                }
            }

            var neighbours = {};
            switch(pos){
            case 0:
                neighbours.next = channels[1];
                break;
            case 1:
                neighbours.prev = channels[0];
                neighbours.next = channels[2];
                break;
            case 2:
                neighbours.prev = channels[1];
                break;
            default:
                break;
            }

            _this.dealNeighbourInfo(neighbours);
        });
    };
    Channel.prototype.dealNeighbourInfo = function(neighbours){
        if(neighbours.prev){
            this.doms.leftLink.attr('href', neighbours.prev.id);
            this.doms.leftLink.attr('title', neighbours.prev.title);
        }
        if(neighbours.next){
            this.doms.rightLink.attr('href', neighbours.next.id);
            this.doms.rightLink.attr('title', neighbours.next.title);
        }
    };

    Channel.prototype.dealItemList = function(items){
        this.data.items = items;
        this.renderItemList({
            items: items
        });
    };

    Channel.prototype.renderChannelInfo = function(data){
        this.doms.title.html(makeChannelTitle(data));
        this.doms.info.html(makeChannelInfo(data));
    };

    Channel.prototype.renderItemList = function(data){
        this.doms.content.html(makeItemList(data));
    };

    module.exports = Channel;
});