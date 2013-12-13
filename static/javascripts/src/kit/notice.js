define(function(require, exports, module){
    var genNotice = require('../template/common/notice');
    var customEvent = require('./customEvent');
    var effect = require('./effect');
    var noticeBlock = $('#notice');

    var visible = false;

    var showNotice = function(){
        if(visible){
            return;
        }

        effect.bodyBlur();
        effect.headerBlur();
        effect.floaterBlur();
        noticeBlock.show();
        visible = true;
    };

    var hideNotice = function(){
        if(!visible){
            return;
        }

        effect.bodyUnblur();
        effect.headerUnblur();
        effect.floaterUnblur();
        noticeBlock.hide();
        visible = false;
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
        notice: renderAndBind,
        visible: function(){
            return visible;
        },
        NotFound: function(){
            renderAndBind('走错地方了。', function(){
                customEvent.trigger('goback');
            });
        }
    };
});
