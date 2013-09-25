define(function(require, exports, module) {
    //var render = require('../template/channel');
    var request = require('../kit/request');
    var URL = require('../kit/url');

    var Channel = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'channel';
    };

    Channel.prototype.init = function(){
        this.getItemList();
    };

    Channel.prototype.bindEvent = function(){};

    Channel.prototype.clean = function(){};

    Channel.prototype.getItemList = function(callback){
        var cid = URL.parse(this.url).id;
        request.get({source: cid}, '/api/item', callback);
    };

    module.exports = Channel;

});