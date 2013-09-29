define(function(require, exports, module) {
    var keypress = require('../kit/keypress');

    var pattern = require('../kit/pattern');
    var request = require('../kit/request');
    var URL = require('../kit/url');
    var customEvent = require('../kit/customEvent');

    var interfaces = require('../interface/index');
    var apis = interfaces.api;
    var pages = require('../interface/index').page;

    var genResult = require('../template/common/result');
    var genTip = require('../template/common/tip');

    var bodyContent = $('#body');
    var globalFloater = $('#floater');
    var globalInput = $('#input');
    var globalTip = $('#tips');
    var globalResult = $('#results');

    var showFloater = function(){
        bodyContent.addClass('blur');
        globalFloater.addClass('show');
        globalInput.val('').focus();
        globalTip.hide();
        globalResult.hide();
    };

    //showFloater();

    var hideFloater = function(){
        bodyContent.removeClass('blur');
        globalFloater.removeClass('show');
    }

    var toggleFloater = function(){
        if(globalFloater.hasClass('show')){
            hideFloater();
        }else{
            showFloater();
        }
    };

    var reloadPage = function(){
        customEvent.trigger('userInfoUpdate');
    };

    var cleanResult = function(){
        globalResult.html('').hide();
    };

    var cleanTip = function(){
        globalTip.html('').hide();
    };

    var cleanAll = function(){
        cleanTip();
        cleanResult();
    };

    var addTip = function(word){
        globalTip.show().prepend(genTip({
            tip: {
                word: word
            }
        }));
    };

    var showTip = function(word){
        cleanTip();
        addTip(word);
    };

    var addResult = function(word, link){
        var link = link || 'javascript:;';
        var target = URL.isSameDomain(link) ? '' : '_blank';
        globalResult.show().append(genResult({
            result: {
                word: word,
                link: link,
                target: target
            }
        }));
    };

    var enterHandler = function(){};

    var createChannel = function(url, callback){
        request.post({
            url: url
        }, apis.channel.create, callback);
    };

    var saveChannel = function(channel, callback){
        request.post({
            channel: channel
        }, apis.channel.save, callback);
    };

    var addSubscription = function(cid, callback){
        request.post({
            subscribee: cid,
            description: ''
        }, apis.subscription.add, callback);
    };

    var dealFeed = function(){

        var url = globalInput.val();
        showTip('A feed url? parsing...');

        createChannel(url, function(err, channel){
            if(url !== currVal){
                return;
            }

            cleanAll();
            if(err){
                showTip('Failed to parse, invalid feed url.');
                return;
            }
            showTip('Press <b>Enter</b> to add & subscribe.');
            addResult(channel.title, channel.link);

            enterHandler = function(){
                saveChannel(channel, function(err, channel){
                    if(err){
                        showTip('Failed to add channel. Please try again.');
                        return;
                    }
                    showTip('Channel ' + channel.title + ' added, subscribing...');
                    addSubscription(channel.id, function(err, subscription){
                        if(err){
                            showTip(
                                'Failed to subscribe channel ' + channel.title + '. Please try again.'
                            );
                            return;
                        }
                        cleanResult();
                        showTip('Channel ' + channel.title + ' subscribed.');
                        reloadPage();
                    });
                });
            };
        });
    };

    var currVal = globalInput.val().trim();
    globalInput.on('keyup', function(e){
        var val = $(this).val().trim();

        if(e.which === 13){// Enter
            if(!enterHandler()){
                return;
            }
        }

        //console.log(val, currVal, val == currVal);//-------------------------------------------
        if(val == currVal){
            return;
        }else{
            currVal = val;
        }

        cleanAll();

        if(pattern.url.test(val)){
            dealFeed();
        }
    });

    keypress.register(27, function(e){
        toggleFloater();
    });
});
