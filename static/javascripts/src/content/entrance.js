define(function(require, exports, module) {
    var request = require('../kit/request');
    var customEvent = require('../kit/customEvent');
    var notice = require('../kit/notice');
    var userinfo = require('../kit/userinfo');
    var eventList = require('../kit/eventList');
    var interfaces = require('../interface/index');
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

        this.eventList.add(doms.signin, 'click', function(){
            doms.signinBlock.fadeIn();
            return false;
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
                notice(err);
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
            submit: $('#submit')
        };
    };

    module.exports = Entrance;
});