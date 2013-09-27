define(function(require, exports, module) {
    var stateManager = require('../module/stateManager');
    var page = require('../module/page');

    var keypress = require('../kit/keypress');
    var pattern = require('../kit/pattern');
    var request = require('../kit/request');

    var interfaces = require('../interface/index').resource;

    stateManager.on('checkout', function(info){
        page.checkout(info);
    });

    var globalFloater = $('#floater');
    var globalInput = $('#input');
    var globalTip = $('#tips');
    var globalResult = $('#results');

    keypress.register(27, function(e){
        if(globalFloater.css('display') === 'none'){
            globalFloater.show();
            globalInput.val('').focus();
            globalTip.hide();
            globalResult.hide();
        }else{
            globalFloater.hide();
        }
    });

    var reloadPageInfo = function(){
        stateManager.checkout();
    };

    var cleanResult = function(){
        globalResult.html('').hide();
    };

    var cleanTip = function(){
        globalTip.html('').hide();
    };

    var addTip = function(tip){
        globalTip.show().prepend('<li class="tip">' + tip + '</li>');
    };

    var addResult = function(result){
        globalResult.show().append('<li class="result">' + result + '</li>');
    };

    var enterHandler = function(){};

    var createChannel = function(url, callback){
        request.post({
            url: url
        }, interfaces.channel.create, callback);
    };

    var saveChannel = function(channel, callback){
        request.post({
            channel: channel
        }, interfaces.channel.save, callback);
    };

    var addSubscription = function(cid, callback){
        request.post({
            subscribee: cid,
            description: ''
        }, interfaces.subscription.add, callback);
    };

    var dealFeed = function(){

        var url = globalInput.val();
        cleanTip();
        addTip('A feed url? parsing...');

        createChannel(url, function(err, channel){
            cleanTip();
            cleanResult();
            if(err){
                addTip('Parse error.');
                return;
            }
            addTip('Press Enter to add');
            addResult(channel.title);

            enterHandler = function(){
                saveChannel(channel, function(err, channel){
                    cleanTip();
                    if(err){
                        addTip('Failed to add channel. Please try again.');
                        return;
                    }
                    addTip('Channel added, subscribing...');
                    addSubscription(channel.id, function(err, subscription){
                        cleanTip();
                        if(err){
                            addTip(
                                'Failed to subscribe channel ' +
                                channel.title +
                                '. Please try again.'
                            );
                            return;
                        }
                        cleanResult();
                        addTip('Channel subscribed.');
                        reloadPageInfo();
                    });
                });
            };
        });
    };

    globalInput.on('keyup', function(e){
        var str = $(this).val();

        if(e.which === 13){// Enter
            if(!enterHandler()){
                return;
            }
        }

        if(pattern.url.test(str)){
            dealFeed();
        }
    });

});