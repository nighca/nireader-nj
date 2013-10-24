define(function(require, exports, module){
    var genNotice = require('../template/common/notice');
    var noticeBlock = $('#notice');
    var body = $('#body');
    var header = $('#header');
    var floater = $('#floater');

    var showNotice = function(){
        body.addClass('blur');
        header.addClass('blur');
        floater.addClass('blur');
        noticeBlock.show();
    };

    var hideNotice = function(){
        body.removeClass('blur');
        header.removeClass('blur');
        floater.removeClass('blur');
        noticeBlock.hide();
    };

    var clean = function(){
        noticeBlock.html('');
    };

    var render = function(word){
        if(typeof word == 'object'){
            word = JSON.stringify(word);
        }

        var notice = {
            word: word
        };
        noticeBlock.html(genNotice({
            notice: notice
        }));
        showNotice();
    };

    var bind = function(callback){
        noticeBlock.find('#confirm').on('click', function(){
            hideNotice();
            callback && callback();
        });
    };

    var renderAndBind = function(word, callback){
        render(word);
        bind(callback);
    };

    var cleanAndHide = function(){
        clean();
        hideNotice();
    };

    module.exports = {
        clean: cleanAndHide,
        notice: renderAndBind
    };
});
