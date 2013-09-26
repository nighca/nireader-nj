define(function(require, exports, module){
    var createContent = require('./createContent');
    var URL = require('../kit/url');

    var page = {
        wrapper: $('#body'),
        middleBlock: $('#middle-block')
    }

    page.getUrl = function(){
        this.url = URL.format(location.href);
    };

    page.initContent = function(){
        this.content = createContent({
            url: this.url,
            wrapper: this.wrapper
        });
        this.content.init();
        this.content.bindEvent();
    };

    page.init = function(){
        this.getUrl();
        this.initContent();
        this.middleBlock.animate({
            'scrollTop' : 0
        }, 300);
    };

    page.clean = function(){
        if(this.content){
            this.content.clean();
        }
        this.content = null;
    };

    page.checkout = function(info){
        this.clean();
        this.init();
    };

    module.exports = page;
});