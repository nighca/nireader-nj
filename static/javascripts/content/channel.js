define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var URL = require('../kit/url');

    var makeItemList = require('../template/itemList');

    var Channel = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'channel';
    };

    Channel.prototype.init = function(){
        this.prepareInfo();
        this.getItemListByPage(1);
    };

    Channel.prototype.bindEvent = function(){};

    Channel.prototype.clean = function(){
        this.doms.content.html('');
    };

    Channel.prototype.prepareInfo = function(){
        var _this = this;

        _this.data = {
            id: URL.parse(_this.url).id
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
        }, _this.dealItemList.bind(this));
    };

    Channel.prototype.dealItemList = function(err, items){
        if(err){
            alert(err);
            return;
        }
        this.data.items = items;
        this.renderItemList(items);
    };

    Channel.prototype.renderItemList = function(items){
        this.doms.content.html(makeItemList({
            items: items
        }));
    };

    module.exports = Channel;
});