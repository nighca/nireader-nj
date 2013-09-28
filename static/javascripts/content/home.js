define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var pagePath = require('../interface/index').page;
    var eventList = require('../kit/eventList').create('content/home');
    var addEvent = eventList.add;

    var genHomeTitle = require('../template/home/title');
    var genHomeInfo = require('../template/home/info');
    var genSubscriptionList = require('../template/home/subscriptionList');
    var genRecommendList = require('../template/home/recommendList');
    var genChannelInfo = require('../template/home/channelInfo');
    var genLoadingIcon = require('../template/common/loadingIcon');

    var Home = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        
        this.type = 'home';
    };

    Home.prototype.init = function(){
        this.prepareInfo();
        this.initDoms();

        this.getSubscriptionListByPage(1);
        this.getRecommendList();
        this.getUserInfo();
        this.dealLinks();

        this.bindEvent();
    };

    Home.prototype.bindEvent = function(){};

    Home.prototype.clean = function(){
        eventList.clean();
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

        _this.sideBlock = _this.genSideBlock();
    };

    Home.prototype.initDoms = function(){
        //this.doms.content.html(genLoadingIcon());
    };

    Home.prototype.genSideBlock = function(){
        var _this = this;
        var hideTimer,
            middleBlock = _this.doms.middleBlock,
            sideBlock = _this.doms.sideBlock,
            sideContent = _this.doms.sideContent;

        var loading = function(){
            sideBlock.addClass('loading');
        };
        var load = function(cnt){
            sideBlock.removeClass('loading');
            sideContent.html(cnt);
        };
        var position = function(li){
            var top = li.offset().top + middleBlock.scrollTop();
            var originTop = parseInt(sideBlock.css('top'), 10);
            sideBlock
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
        var hide = function(){
            hideTimer = setTimeout(function(){
                sideBlock.hide();
            }, 200);
        };
        var stopHide = function(){
            if(hideTimer){
                hideTimer = clearTimeout(hideTimer);
            }
        };

        var getInfoAndRender = function(){
            stopHide();

            var $this = $(this);
            var cid = $this.attr('data-id');
            sideBlock.attr('data-cid', cid)
            position($this);
            loading();

            resource.get('channel', {
                id: cid
            }, function(err, channel){
                if(sideBlock.attr('data-cid') != cid){
                    return;
                }
                if(err){
                    load('Get channel info failed.');
                    return;
                }
                load(genChannelInfo({
                    channel: channel
                }));
            });
        };

        var bind = function(list){
            addEvent(list.find('.item'), 'mouseenter', getInfoAndRender);
            addEvent(list, 'mouseleave', hide);
        };

        addEvent(sideBlock, 'mouseenter', stopHide);
        addEvent(sideBlock, 'mouseleave', hide);

        //channel-subscribed

        return {
            bind: bind
        };
    };

    Home.prototype.getUserInfo = function(){
        var _this = this;
        resource.get('user', {
        }, function(err, user){
            if(err){
                console.error(err || 'Can not get user info.');
                return;
            }
            _this.dealUserInfo(user);
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

    Home.prototype.getRecommendList = function(){
        var _this = this;
        resource.makeList('channel', {
        }, function(err, recommends){
            if(err){
                console.error(err);
                return;
            }
            _this.dealRecommendList(recommends);
        })(1);
    };

    Home.prototype.dealRecommendList = function(recommends){
        this.data.recommends = recommends;
        this.renderRecommendList({
            recommends: recommends
        });
    };

    Home.prototype.renderHomeInfo = function(data){
        this.doms.title.html(genHomeTitle(data));
        this.doms.info.html(genHomeInfo(data));
    };

    Home.prototype.renderSubscriptionList = function(data){
        this.doms.content.find('.loading-tip').hide();
        this.doms.content.prepend(genSubscriptionList(data));

        this.sideBlock.bind(this.doms.content.find('#subscription-list'));
    };

    Home.prototype.renderRecommendList = function(data){
        this.doms.content.append(genRecommendList(data));
        this.sideBlock.bind(this.doms.content.find('#recommend-list'));
    };

    module.exports = Home;
});