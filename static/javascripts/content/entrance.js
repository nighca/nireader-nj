define(function(require, exports, module) {
    var request = require('../kit/request');
    var customEvent = require('../kit/customEvent');
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
        this.bindEvent();
    };

    Entrance.prototype.bindEvent = function(){
        var doms = this.doms;

        addEvent(doms.signin, 'click', function(){
            doms.signinBlock.fadeIn();
            return false;
        });

        addEvent(doms.submit, 'click', function(){
            var username = doms.nameIn.val();
            var password = doms.passwordIN.val();

            if(!username || !password){
                return;
            }

            request.post({
                username: username,
                password: password
            }, apis.auth.in, function(err, data){
                if(!err){
                    customEvent.trigger('goto', '/');
                }
            });
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
            signin: $('#signin'),
            signinBlock: $('#signin-block'),
            nameIn: $('#name-in'),
            passwordIN: $('#password-in'),
            submit: $('#submit')
        };
    };

    module.exports = Entrance;
});