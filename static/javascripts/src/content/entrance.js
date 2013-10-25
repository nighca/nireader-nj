define(function(require, exports, module) {
    var request = require('../kit/request');
    var customEvent = require('../kit/customEvent');
    var notice = require('../kit/notice').notice;
    var userinfo = require('../kit/userinfo');
    var eventList = require('../kit/eventList');
    var url = require('../kit/url');
    var interfaces = require('../interface/index');
    var authConfig = require('../config').auth;
    var apis = interfaces.api;
    var pages = interfaces.page;

    var pageTitle = $('title');

    var goHome = function(){
        customEvent.trigger('goto', pages.home);
    };

    var Entrance = function(opt){
        this.url = opt.url;
        //this.wrapper = opt.wrapper;
        this.eventList = eventList.create('content/entrance');
        
        this.type = 'entrance';
    };

    Entrance.prototype.init = function(){
        userinfo.isLogin(function(isIn){
            if(isIn){
                goHome();
            }
        });

        this.prepareInfo();
        pageTitle.text('Welcome');

        this.dealLinks();

        this.bindEvent();
    };

    Entrance.prototype.dealLinks = function(){
        this.doms.topLink.hide();
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };

    Entrance.prototype.bindEvent = function(){
        var _this = this;
        var doms = this.doms;

        /*this.eventList.add(doms.signin, 'click', function(){
            doms.signinBlock.fadeIn();
            return false;
        });*/

        this.eventList.add(doms.qq, 'click', function(e){
            var config = authConfig.qq;
            var authUrl = pages.auth.qq.auth;
            var redirect_uri = encodeURIComponent(url.complete(pages.auth.qq.callback));
            authUrl += '?response_type=' + 'token';
            authUrl += '&client_id=' + config.clientId;
            authUrl += '&redirect_uri=' + redirect_uri;
            authUrl += '&scope=' + config.scope;

            window.finishAuth = function(params){
                //console.log('!!!!!!!!!!!!!!!!', params)
                var getIdUrl = pages.auth.qq.getId;
                getIdUrl += '?access_token=' + params.access_token;

                window.callback = function(result){
                    request.post({
                        username: result.openid,
                        password: params.access_token,
                        thirdParty: 'qq'
                    }, apis.auth.in, function(err, data){
                        if(err){
                            notice(data);
                            return;
                        }
                        goHome();
                    });

                    delete window.callback;
                };

                var script = document.createElement('script');
                script.src = getIdUrl;
                document.body.appendChild(script);

                delete window.finishAuth;
            };

            window.open(authUrl);
        });

        this.eventList.add(doms.submit, 'click', function(e){
            _this.signIn();
        });

        this.eventList.add(doms.passwordIN, 'keyup', function(e){
            if(e.which === 13){// Enter
                _this.signIn();
            }
        });

    };

    Entrance.prototype.signIn = function(){
        var username = this.doms.nameIn.val();
        var password = this.doms.passwordIN.val();

        if(!username || !password){
            return;
        }

        request.post({
            username: username,
            password: password
        }, apis.auth.in, function(err, data){
            if(err){
                notice('错了。');
                return;
            }
            goHome();
        });
    };

    Entrance.prototype.clean = function(){
        this.eventList.clean();
        this.doms.wrapper.animate({
            marginTop: -this.doms.wrapper.height() + 'px'
        }, 1000, function(){
            $(this).hide();
        });
    };

    Entrance.prototype.prepareInfo = function(){
        this.doms = {
            wrapper: $('#header'),
            leftLink: $('#left-link'),
            rightLink: $('#right-link'),
            topLink: $('#top-link'),
            signin: $('#signin'),
            signinBlock: $('#signin-block'),
            nameIn: $('#name-in'),
            passwordIN: $('#password-in'),
            submit: $('#submit'),
            qq: $('#qq')
        };
    };

    module.exports = Entrance;
});