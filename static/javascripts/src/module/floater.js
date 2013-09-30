define(function(require, exports, module) {
    var keypress = require('../kit/keypress');

    var pattern = require('../kit/pattern');
    var request = require('../kit/request');
    var notice = require('../kit/notice');
    var URL = require('../kit/url');
    var customEvent = require('../kit/customEvent');

    var interfaces = require('../interface/index');
    var apis = interfaces.api;
    var pages = interfaces.page;

    var genResult = require('../template/common/result');
    var genTip = require('../template/common/tip');
    var loadingIcon = require('../template/common/loadingIcon')();

    var bodyContent = $('#body');
    var globalFloater = $('#floater');
    var globalInput = $('#input');
    var globalTip = $('#tips');
    var globalResult = $('#results');

    var currVal;
    var initInfo = function(){
        currVal = globalInput.val().trim();
    };
    var initDom = function(){
        globalInput.val('').focus();
        checkInput();
        globalTip.hide();
        globalResult.hide();
    };

    var showFloater = function(){
        bodyContent.addClass('blur');
        globalFloater.addClass('show');
        
        initDom();
        initInfo();
    };

    //showFloater();

    var hideFloater = function(){
        bodyContent.removeClass('blur');
        globalFloater.removeClass('show');
    };

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

    var addResult = function(word, link, async){
        link = link || 'javascript:;';
        var target = URL.isSameDomain(link) ? '' : '_blank';
        globalResult.show().append(genResult({
            result: {
                word: word,
                link: link,
                target: target,
                async: async
            }
        }));
    };

    var enterHandler, tabHandler;

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
        showTip('A feed url? parsing... ' + loadingIcon);

        createChannel(url, function(err, channel){
            if(url !== currVal){
                return;
            }

            cleanAll();
            if(err){
                showTip('Failed to parse, invalid feed url.');
                return;
            }

            var exist = !!channel.id;
            showTip('Press <b>Enter</b> to ' + (exist ? '' : 'add & ') + 'subscribe.');
            addResult(channel.title, exist ? pages.channel(channel.id) : channel.link, exist);

            enterHandler = function(){
                saveChannel(channel, function(err, channel){
                    if(err){
                        showTip('Failed to add channel. Please try again.');
                        return;
                    }
                    showTip('Channel ' + channel.title + ' added, subscribing... ' + loadingIcon);
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

    var dealLogout = function(){
        showTip('Press <b>Enter</b> to logout.');

        enterHandler = function(){
            showTip('logout ing... ' + loadingIcon);
            request.get(apis.auth.out, function(err){
                if(err){
                    notice(err);
                    return;
                }
                location.href = pages.home;
            });
        };
    };

    var dealHome = function(){
        showTip('Press <b>Enter</b> to go to home (\'/\').');

        enterHandler = function(){
            showTip('going to home... ' + loadingIcon);
            customEvent.trigger('goto', '/');
            cleanTip();
        };
    };

    var cmds = {
        'logout': dealLogout,
        'home': dealHome
    };

    var checkInput = function(){
        var val = globalInput.val().trim();

        // No change
        if(val == currVal){
            return;
        }else{
            currVal = val;
        }

        // Clean result
        cleanAll();

        // CMD
        if(val && cmds[val]){
            cmds[val]();
            return;
        }

        // Feed url
        if(val && pattern.url.test(val)){
            dealFeed();
            return;
        }

        // CMD hint
        var pos, str, cmd;
        if(val){
            for(var c in cmds){
                if(cmds.hasOwnProperty(c) && (pos = c.indexOf(val)) >= 0){
                    cmd = c;
                    str =
                        c.slice(0, pos) +
                        '<b>' +
                        val +
                        '</b>' +
                        c.slice(pos + val.length) +
                        '\t ---- Use <b>Tab</b>';
                    addTip(str);
                }
            }
        }
        tabHandler = cmd && function(e){
            globalInput.val(cmd);
            //checkInput();
        };
    };

    globalInput.on('keydown', function(e){
        // Tab
        if(e.which === 9){
            e.preventDefault();
            if(tabHandler && !tabHandler(e)){
                return;
            }
        }
    });

    globalInput.on('keyup', function(e){
        // Enter
        if(e.which === 13){
            if(enterHandler && !enterHandler(e)){
                globalInput.val('');
                return;
            }
        }

        checkInput();
    });

    keypress.register(27, function(e){
        toggleFloater();
    });
});
