define(function(require, exports, module) {
    var request = require('../kit/request');
    var customEvent = require('../kit/customEvent');
    var notice = require('../kit/notice');
    var eventList = require('../kit/eventList').create('content/entrance');
    var addEvent = eventList.add;
    var apis = require('../interface/index').api;

    var Entrance = function(opt){
        this.url = opt.url;
        //this.wrapper = opt.wrapper;
        
        this.type = 'entrance';
    };

    Entrance.prototype.init = function(){
        this.prepareInfo();
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

        addEvent(doms.signin, 'click', function(){
            doms.signinBlock.fadeIn();
            return false;
        });

        addEvent(doms.submit, 'click', function(e){
            _this.signIn();
        });

        addEvent(doms.passwordIN, 'keyup', function(e){
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
            customEvent.trigger('goto', '/');
        });
    };

    Entrance.prototype.clean = function(){
        eventList.clean();
        this.doms.wrapper.animate({
            marginTop: '-100%'
        }, 1000);
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