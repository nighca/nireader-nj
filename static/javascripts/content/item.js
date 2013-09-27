define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var URL = require('../kit/url');

    var genItemTitle = require('../template/item/title');
    var genItemInfo = require('../template/item/info');
    var genItemContent = require('../template/item/content');
    var genItemChannelTitle = require('../template/item/channelTitle');

    var Item = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'item';
    };

    Item.prototype.init = function(){
    	var _this = this;

        _this.prepareInfo();
        _this.getItemInfo(function(){
        	_this.getChannelInfo();
        	_this.getNeighbourInfo();
        });

        _this.bindEvent();
    };

    Item.prototype.bindEvent = function(){};

    Item.prototype.clean = function(){
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
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
        }, function(err, items){
            if(err || items.length < 1){
                console.error(err || 'No such item');
                return;
            }
            _this.dealItemInfo(items[0]);
            callback && callback();
        });
    };

    Item.prototype.getChannelInfo = function(){
        var _this = this;
        resource.get('channel', {
            id: _this.data.item.source
        }, function(err, channels){
            if(err || channels.length < 1){
                console.error(err || 'Can not get channel');
                return;
            }
            _this.dealChannelInfo(channels[0]);
        });
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

    Item.prototype.getNeighbourInfo = function(){
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
        });
    };
    Item.prototype.dealNeighbourInfo = function(neighbours){
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