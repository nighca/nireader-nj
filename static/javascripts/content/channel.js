define(function(require, exports, module) {
    //var render = require('../template/channel');

    var Channel = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'channel';
    };

    Channel.prototype.init = function(){
        
    };
    Channel.prototype.bindEvent = function(){};

    module.exports = Channel;

});