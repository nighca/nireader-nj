define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;

    var genHomeTitle = require('../template/home/title');
    var genHomeInfo = require('../template/home/info');
    var genSubscriptionList = require('../template/home/subscriptionList');
    var genChannelInfo = require('../template/home/channelInfo');

    var Home = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'home';
    };

    Home.prototype.init = function(){
        this.prepareInfo();
        this.getSubscriptionListByPage(1);
        this.getUserInfo();
        this.dealLinks();

        this.bindEvent();
    };

    Home.prototype.bindEvent = function(){};

    Home.prototype.clean = function(){
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.sideContent.html('');
        this.doms.sideBlock.clearQueue().stop().hide();
        this.doms.leftLink.attr('href', '').show();
        this.doms.rightLink.attr('href', '').show();
        this.doms.topLink.attr('href', '').show();
    };

    Home.prototype.prepareInfo = function(){
        var _this = this;

        _this.data = {
        };

        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find('#middle-block'),
            title: _this.wrapper.find('#title'),
            info: _this.wrapper.find('#info'),
            content: _this.wrapper.find('#content'),
            sideBlock: _this.wrapper.find('#side-block'),
            sideContent: _this.wrapper.find('#side-content'),
            leftLink: _this.wrapper.find('#left-link'),
            rightLink: _this.wrapper.find('#right-link'),
            topLink: _this.wrapper.find('#top-link')
        };
    };

    Home.prototype.getUserInfo = function(){
        var _this = this;
        resource.get('user', {
        }, function(err, users){
            if(err || users.length < 1){
                console.error(err || 'Can not get user info.');
                return;
            }
            _this.dealUserInfo(users[0]);
        });
    };

    Home.prototype.dealUserInfo = function(user){
        this.data.user = user;
        this.renderHomeInfo({
            user: user
        });
    };

    Home.prototype.dealLinks = function(){
        this.doms.topLink.hide();
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };

    Home.prototype.getSubscriptionListByPage = function(page){
        var _this = this;
        resource.makeList('subscription', {
        }, function(err, subscriptions){
            if(err){
                console.error(err);
                return;
            }
            _this.dealSubscriptionList(subscriptions);
        })(page);
    };

    Home.prototype.dealSubscriptionList = function(subscriptions){
        this.data.subscriptions = subscriptions;
        this.renderSubscriptionList({
            subscriptions: subscriptions
        });
    };

    Home.prototype.renderHomeInfo = function(data){
        this.doms.title.html(genHomeTitle(data));
        this.doms.info.html(genHomeInfo(data));
    };

    Home.prototype.sideBlockLoading = function(){
        this.doms.sideBlock.addClass('loading');
    };

    Home.prototype.sideBlockLoad = function(cnt){
        this.doms.sideBlock.removeClass('loading');
        this.doms.sideContent.html(cnt);
    };

    Home.prototype.sideBlockGoto = function(li){
        var top = li.offset().top + this.doms.middleBlock.scrollTop();
        var originTop = parseInt(this.doms.sideBlock.css('top'), 10);
        this.doms.sideBlock
            .stop()
            .clearQueue()
            .show()
            .delay(200)
            .animate({
                'top': (top * 6 - originTop)/5
            }, 100)
            .animate({
                'top': top
            }, 50);
    };

    Home.prototype.renderSubscriptionList = function(data){
        var _this = this;
        _this.doms.content.html(genSubscriptionList(data));
        var timer;
        _this.doms.content.find('.item').on('mouseenter', function(){
            if(timer){
                timer = clearTimeout(timer);
            }

            var $this = $(this);
            var cid = $this.attr('data-id');
            _this.doms.sideBlock.attr('data-cid', cid)
            _this.sideBlockGoto($this);
            _this.sideBlockLoading();

            resource.get('channel', {
                id: cid
            }, function(err, channels){
                if(_this.doms.sideBlock.attr('data-cid') != cid){
                    return;
                }
                if(err){
                    _this.sideBlockLoad(JSON.stringify(err));
                    return;
                }
                if(channels.length < 1){
                    _this.sideBlockLoad('Get channel info failed.');
                    return;
                }
                _this.sideBlockLoad(genChannelInfo({
                    channel: channels[0]
                }));
            });
        });
        _this.doms.content.on('mouseleave', function(){
            timer = setTimeout(function(){
                _this.doms.sideBlock.hide();
            }, 200);
        });
    };

    module.exports = Home;
});