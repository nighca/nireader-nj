define(function(require, exports, module) {
    var keypress = require('../kit/keypress');
    var pattern = require('../kit/pattern');
    var request = require('../kit/request');
    var resource = require('../kit/resource');
    var notice = require('../kit/notice').notice;
    var URL = require('../kit/url');
    var customEvent = require('../kit/customEvent');
    var customLink = require('../kit/customLink');
    var effect = require('../kit/effect');

    var cmds = require('./cmd');

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
        globalInput.val('');
        globalInput.focus();
        checkInput();
        globalTip.hide();
        globalResult.hide();
    };

    var visible;
    var showFloater = function(){
        if(visible){
            return;
        }

        effect.bodyBlur();
        effect.headerBlur();
        globalFloater.addClass('show');
        
        initDom();
        initInfo();
        visible = true;
    };

    var hideFloater = function(){
        if(!visible){
            return;
        }

        effect.bodyUnblur();
        effect.headerUnblur();
        globalFloater.removeClass('show');
        visible = false;
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

    var tip = {
        add: addTip,
        show: showTip,
        clean: cleanTip
    },result = {
        add: addResult,
        clean: cleanResult
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
        showTip('好像是个rss地址，等我解析下... ' + loadingIcon);

        createChannel(url, function(err, channel){
            if(url !== currVal){
                return;
            }

            cleanAll();
            if(err){
                showTip('没解析出来，地址不对。');
                return;
            }

            var exist = !!channel.id;
            showTip('用<b>Enter</b>' + (exist ? '' : '添加并') + '订阅');
            addResult(channel.title, exist ? pages.channel(channel.id) : channel.link, exist);

            enterHandler = function(){
                saveChannel(channel, function(err, channel){
                    if(err){
                        showTip('没添加成功。');
                        return;
                    }
                    showTip(channel.title + '添加好了，正在订阅... ' + loadingIcon);
                    addSubscription(channel.id, function(err, subscription){
                        if(err){
                            showTip(
                                '订阅' + channel.title + '没成功。（' + err + '）'
                            );
                            return;
                        }
                        cleanResult();
                        showTip('订阅了' + channel.title + '。');
                        reloadPage();
                    });
                });
            };
        });
    };

    var doSearch = function(val){
        if(val){
            var keywords = val.split(' '), realKeywords = [];
            for (var i = 0, l = keywords.length; i < l; i++) {
                if(keywords[i]){
                    realKeywords.push(keywords[i]);
                }
            }
            if(!realKeywords.length){
                return;
            }

            //addTip('searching... ' + loadingIcon);
            resource.search('channel', realKeywords, 1, function(err, channels){
                if(val !== currVal){
                    return;
                }

                if(!err){
                    for (var i = 0, l = channels.length; i < l; i++) {
                        addResult(channels[i].title, pages.channel(channels[i].id), true);
                    }
                }
            });
        }
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

        // Clean handler
        enterHandler = tabHandler = null;

        // Search for channels
        doSearch(val);

        // CMD
        var cmd;
        if(val && (cmd = cmds[val])){
            cmd.usage && showTip('按<b>Enter</b>' + cmd.usage + '。');
            enterHandler = cmd.handler(val, tip, result);
            return;
        }

        // Feed url
        if(val && pattern.url.test(val)){
            dealFeed();
            return;
        }

        // CMD hint
        var pos, hint, matches = [];
        if(val){
            for(var c in cmds){
                if(cmds.hasOwnProperty(c) && (pos = c.indexOf(val)) >= 0 && !cmds[c].nohint){
                    matches.push({
                        cmd: c,
                        pos: pos
                    });
                }
            }
            var maxNum = 3,
                last = (maxNum < matches.length ? maxNum : matches.length) - 1;
            matches.slice(0, maxNum).sort(function(a, b){
                return a.pos < b.pos;
            }).forEach(function(match, i){
                var c = match.cmd,
                    p = match.pos,
                    str =
                        c.slice(0, p) +
                        '<b>' +
                        val +
                        '</b>' +
                        c.slice(p + val.length);
                if(i === last){
                    str += '\t ---- 用<b>Tab</b>补全';
                    hint = c;
                }
                addTip(str);
            });
        }
        tabHandler = hint && function(e){
            globalInput.val(hint);
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

    customLink.on('global-input', function(val){
        currVal = '';
        globalInput.val(val);
        globalInput.focus();

        cleanAll();     // in case new val same as currVal > no cleanAll in checkInput
        checkInput();
    });

    module.exports = {
        visible: function(){
            return visible;
        }
    };
});
