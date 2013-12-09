define(function(require, exports, module) {
    var resource = require('../kit/resource');
    var request = require('../kit/request');
    var notice = require('../kit/notice').notice;
    var userinfo = require('../kit/userinfo');
    var eventList = require('../kit/eventList');
    var customEvent = require('../kit/customEvent');
    var effect = require('../kit/effect');
    var interfaces = require('../interface/index');
    var apis = interfaces.api;
    var pages = interfaces.page;

    var genHomeTitle = require('../template/home/title');
    var genHomeInfo = require('../template/home/info');
    var genSubscriptionList = require('../template/home/subscriptionList');
    var genRecommendList = require('../template/home/recommendList');
    var genChannelInfo = require('../template/home/channelInfo');

    var pageTitle = $('title');

    var Home = function(opt){
        this.url = opt.url;
        this.wrapper = opt.wrapper;

        this.eventList = eventList.create('content/home');

        this.type = 'home';
    };

    Home.prototype.init = function(){
        userinfo.isLogin(function(isIn){
            if(!isIn){
                location.href = pages.entrance;
            }
        });

        this.prepareInfo();
        this.initDoms();

        this.getAllSubscriptionList();
        this.getRecommendList();
        this.getUserInfo();
        this.dealLinks();

        this.bindEvent();
    };

    Home.prototype.bindEvent = function(){
        var _this = this;
        this.eventList.add(customEvent, 'userInfoUpdate', function(){
            _this.refreshSubscriptionList();
        });
    };

    Home.prototype.clean = function(){
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.sideContent.html('');
        this.doms.sideBlock.clearQueue().stop().hide();
        this.doms.leftLink.attr('href', '').show();
        this.doms.rightLink.attr('href', '').show();
        this.doms.topLink.attr('href', '').show();
        effect.bodyBlur();
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

        var subscribe = function(cid, icon){
            icon.addClass('icon-spinner icon-spin');

            request.post({
                subscribee: cid
            }, apis.subscription.add, function(err, subscription){
                icon.removeClass('icon-spinner icon-spin');
                if(err){
                    notice('没订阅成');
                    LOG(err);
                }else{
                    icon
                        .addClass('icon-eye-open')
                        .removeClass('icon-eye-close');
                    _this.refreshSubscriptionList();
                }
            });
        };

        var cancelSubscribe = function(cid, icon){
            icon.addClass('icon-spinner icon-spin');

            request.post({
                subscribee: cid
            }, apis.subscription.remove, function(err, subscription){
                icon.removeClass('icon-spinner icon-spin');
                if(err){
                    notice('没能取消订阅');
                    LOG(err);
                }else{
                    icon
                        .addClass('icon-eye-close')
                        .removeClass('icon-eye-open');
                    _this.refreshSubscriptionList();
                    hide();
                }
            });
        };

        var bindSubscribe = function(cid){
            var icon = sideBlock.find('#channel-subscribed');
            _this.eventList.add(icon, 'click', function(e){
                (icon.hasClass('icon-eye-open') ? cancelSubscribe : subscribe)(cid, icon);
            });
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

                for (var i = _this.data.subscriptions.length - 1; i >= 0; i--) {
                    if(_this.data.subscriptions[i].id == channel.id){
                        channel.subscribed = true;
                        break;
                    }
                }
                load(genChannelInfo({
                    channel: channel
                }));
                bindSubscribe(cid);
            });
        };

        var bind = function(list){
            _this.eventList.add(list.find('.item'), 'mouseenter', getInfoAndRender);
            _this.eventList.add(list, 'mouseleave', hide);
        };

        _this.eventList.add(sideBlock, 'mouseenter', stopHide);
        _this.eventList.add(sideBlock, 'mouseleave', hide);

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
        resource.makeList('subscription', null, function(err, subscriptions){
            if(err){
                console.error(err);
                return;
            }
            _this.data.subscriptionListPage = page;
            _this.dealSubscriptionList(subscriptions);
        })(page);
    };

    Home.prototype.getAllSubscriptionList = function(refresh){
        var _this = this;
        resource.makeList('subscription', null, function(err, subscriptions){
            if(err){
                console.error(err);
                return;
            }
            _this.dealSubscriptionList(subscriptions);
        }, null, null, refresh)();
    };

    Home.prototype.refreshSubscriptionList = function(){
        this.doms.subscriptionList && this.doms.subscriptionList.remove();
        //this.getSubscriptionListByPage(this.data.subscriptionListPage);
        this.getAllSubscriptionList(true);
    };

    Home.prototype.dealSubscriptionList = function(subscriptions){
        subscriptions.map(function(subscription){
            subscription.pageUrl = pages.myChannel(subscription.id);
            return subscription;
        });
        this.data.subscriptions = subscriptions;
        this.renderSubscriptionList({
            subscriptions: subscriptions
        });
    };

    Home.prototype.getRecommendList = function(){
        var _this = this;
        resource.makeList('channel', null, function(err, recommends){
            if(err){
                console.error(err);
                return;
            }
            _this.dealRecommendList(recommends);
        }, {
            order: 'score',
            descrease: true
        })(1);
    };

    Home.prototype.dealRecommendList = function(recommends){
        recommends.map(function(recommend){
            recommend.pageUrl = pages.recommendChannel(recommend.id);
            return recommend;
        });
        this.data.recommends = recommends;
        this.renderRecommendList({
            recommends: recommends
        });
    };

    Home.prototype.renderHomeInfo = function(data){
        pageTitle.text(data.user.name + '\'s reader');
        this.doms.title.html(genHomeTitle(data));
        this.doms.info.html(genHomeInfo(data));
    };

    Home.prototype.renderSubscriptionList = function(data){
        if(this.recommendListReady){
            this.doms.content.prepend(genSubscriptionList(data));
        }else{
            this.doms.content.html(genSubscriptionList(data));
        }
        this.subscriptionListReady = true;
        
        effect.bodyUnblur();

        this.doms.subscriptionList = this.doms.content.find('#subscription-list');
        this.sideBlock.bind(this.doms.subscriptionList);
    };

    Home.prototype.renderRecommendList = function(data){
        if(this.subscriptionListReady){
            this.doms.content.append(genRecommendList(data));
        }else{
            this.doms.content.html(genRecommendList(data));
        }
        this.recommendListReady = true;

        this.doms.recommendList = this.doms.content.find('#recommend-list');

        var p = 20;
        this.doms.recommendList.children().each(function(i, li){
            $(li).css('opacity',(p-i)/p);
        });

        this.sideBlock.bind(this.doms.recommendList);
    };

    module.exports = Home;
});