define("nireader/nireader-fe/2.0.0/page/reader-debug", [ "../module/stateManager-debug", "../kit/url-debug", "../kit/customEvent-debug", "../module/page-debug", "../module/createContent-debug", "../content/home-debug", "../kit/resource-debug", "../kit/request-debug", "../kit/cache-debug", "../config-debug", "../interface/index-debug", "../kit/notice-debug", "../kit/userinfo-debug", "../kit/cookie-debug", "../kit/eventList-debug", "../template/home/title-debug", "../template/template-debug", "../kit/time-debug", "../kit/num-debug", "../template/home/info-debug", "../template/home/subscriptionList-debug", "../template/home/recommendList-debug", "../template/home/channelInfo-debug", "../content/entrance-debug", "../content/channel-debug", "../template/channel/title-debug", "../template/channel/info-debug", "../template/channel/itemList-debug", "../content/item-debug", "../template/item/title-debug", "../template/item/info-debug", "../template/item/content-debug", "../template/item/channelTitle-debug", "../kit/testScroll-debug", "../module/floater-debug", "../kit/keypress-debug", "../kit/pattern-debug", "../template/common/result-debug", "../template/common/tip-debug", "../template/common/loadingIcon-debug" ], function(require, exports, module) {
    var stateManager = require("../module/stateManager-debug");
    var page = require("../module/page-debug");
    var floater = require("../module/floater-debug");
    var init = function() {
        stateManager.on("checkout", function(info) {
            page.checkout(info);
        });
    };
    module.exports = {
        name: "reader",
        init: init
    };
});

define("nireader/nireader-fe/2.0.0/module/stateManager-debug", [ "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug" ], function(require, exports, module) {
    var formatUrl = require("nireader/nireader-fe/2.0.0/kit/url-debug").format;
    var customEvent = require("nireader/nireader-fe/2.0.0/kit/customEvent-debug");
    var StateManager = function(opt) {
        this.handlers = {};
        this.init();
    };
    StateManager.prototype.init = function() {
        this.bindEvent();
    };
    StateManager.prototype.bindEvent = function() {
        var manager = this;
        var gotoUrl = function(url) {
            url = formatUrl(url);
            manager.pushState({
                url: url,
                title: "Loading"
            });
            manager.checkout();
        };
        $("body").delegate("[data-link-async]", "click", function(e) {
            e.preventDefault();
            var link = $(this);
            if (link.attr("disabled")) {
                return false;
            }
            gotoUrl(link.attr("href"));
        });
        customEvent.on("goto", gotoUrl);
        window.onpopstate = function(e) {
            manager.checkout();
        };
    };
    StateManager.prototype.pushState = function(state) {
        history.pushState(state, state.title, state.url);
    };
    StateManager.prototype.checkout = function(target, callback) {
        var manager = this;
        this.trigger("checkout");
    };
    StateManager.prototype.on = function(event, handler) {
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(handler);
    };
    StateManager.prototype.trigger = function(event) {
        var list = this.handlers[event], args = Array.prototype.slice.call(arguments, 1);
        if (list) {
            for (var i = 0, l = list.length; i < l; i++) {
                try {
                    list[i].apply(this, args);
                } catch (e) {
                    console.warn(e);
                    console.log(e.stack);
                }
            }
        }
    };
    module.exports = new StateManager();
});

define("nireader/nireader-fe/2.0.0/kit/url-debug", [], function(require, exports, module) {
    var removeBeforeSlash = function(url) {
        var p = url.indexOf("://");
        if (p < 0) {
            return url;
        }
        url = url.slice(p + 3);
        p = url.indexOf("/");
        if (p < 0) {
            return "/";
        }
        return url.slice(p);
    };
    var concatWithCurrentPath = function(url) {
        if (!url.indexOf("/")) {
            return url;
        }
        return location.pathname.replace(/([\w\d\_]*)$/, url);
    };
    var formatUrl = function(url) {
        if (!url) {
            return null;
        }
        url = removeBeforeSlash(url);
        url = concatWithCurrentPath(url);
        return url;
    };
    /*var getType = function(url){
        var pattern = /([^\/]+)\/[^\/]+$/;
        return pattern.test(url) ? pattern.exec(url)[1] : null;
    };*/
    var parseUrl = function(url) {
        //var pattern = /([^\/]+)\/([^\/]+)$/;
        var pattern = /\/([\w]*)(\/([\w]+))?($|\?)/;
        var result = {};
        if (pattern.test(url)) {
            var t = pattern.exec(url);
            result.type = t[1];
            if (t[3]) {
                result.id = parseInt(t[3], 10);
            }
        }
        return result;
    };
    var isSameDomain = function(url) {
        if (url.indexOf("://") < 0) {
            return true;
        }
        if (url.indexOf(location.origin) === 0) {
            return true;
        }
        return false;
    };
    exports.format = formatUrl;
    //exports.getType = getType;
    exports.parse = parseUrl;
    exports.isSameDomain = isSameDomain;
});

define("nireader/nireader-fe/2.0.0/kit/customEvent-debug", [], function(require, exports, module) {
    var lists = {};
    module.exports = {
        on: function(event, handler) {
            var list = lists[event] = lists[event] || [];
            // avoid repeated bind
            if (list.indexOf(handler) >= 0) {
                return;
            }
            list.push(handler);
        },
        off: function(event, handler) {
            var list, pos;
            if (list = lists[event]) {
                if ((pos = list.indexOf(handler)) >= 0) {
                    list.splice(pos, 1);
                }
            }
        },
        trigger: function(event) {
            var list;
            if (list = lists[event]) {
                for (var i = 0, l = list.length; i < l; i++) {
                    try {
                        list[i].apply(null, Array.prototype.slice.call(arguments, 1));
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
            }
        }
    };
});

define("nireader/nireader-fe/2.0.0/module/page-debug", [ "nireader/nireader-fe/2.0.0/module/createContent-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/content/home-debug", "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/notice-debug", "nireader/nireader-fe/2.0.0/kit/userinfo-debug", "nireader/nireader-fe/2.0.0/kit/cookie-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug", "nireader/nireader-fe/2.0.0/template/home/title-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/home/info-debug", "nireader/nireader-fe/2.0.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.0.0/template/home/recommendList-debug", "nireader/nireader-fe/2.0.0/template/home/channelInfo-debug", "nireader/nireader-fe/2.0.0/content/entrance-debug", "nireader/nireader-fe/2.0.0/content/channel-debug", "nireader/nireader-fe/2.0.0/template/channel/title-debug", "nireader/nireader-fe/2.0.0/template/channel/info-debug", "nireader/nireader-fe/2.0.0/template/channel/itemList-debug", "nireader/nireader-fe/2.0.0/content/item-debug", "nireader/nireader-fe/2.0.0/template/item/title-debug", "nireader/nireader-fe/2.0.0/template/item/info-debug", "nireader/nireader-fe/2.0.0/template/item/content-debug", "nireader/nireader-fe/2.0.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.0.0/kit/testScroll-debug" ], function(require, exports, module) {
    var createContent = require("nireader/nireader-fe/2.0.0/module/createContent-debug");
    var URL = require("nireader/nireader-fe/2.0.0/kit/url-debug");
    var page = {
        wrapper: $("#body"),
        middleBlock: $("#middle-block")
    };
    page.getUrl = function() {
        this.url = URL.format(location.href);
    };
    page.initContent = function() {
        this.content = createContent({
            url: this.url,
            wrapper: this.wrapper
        });
        this.content.init();
    };
    page.init = function() {
        this.getUrl();
        this.initContent();
        this.middleBlock.animate({
            scrollTop: 0
        }, 300);
    };
    page.clean = function() {
        if (this.content) {
            this.content.clean();
        }
        this.content = null;
    };
    page.checkout = function(info) {
        this.clean();
        this.init();
    };
    module.exports = page;
});

define("nireader/nireader-fe/2.0.0/module/createContent-debug", [ "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/content/home-debug", "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/notice-debug", "nireader/nireader-fe/2.0.0/kit/userinfo-debug", "nireader/nireader-fe/2.0.0/kit/cookie-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug", "nireader/nireader-fe/2.0.0/template/home/title-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/home/info-debug", "nireader/nireader-fe/2.0.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.0.0/template/home/recommendList-debug", "nireader/nireader-fe/2.0.0/template/home/channelInfo-debug", "nireader/nireader-fe/2.0.0/content/entrance-debug", "nireader/nireader-fe/2.0.0/content/channel-debug", "nireader/nireader-fe/2.0.0/template/channel/title-debug", "nireader/nireader-fe/2.0.0/template/channel/info-debug", "nireader/nireader-fe/2.0.0/template/channel/itemList-debug", "nireader/nireader-fe/2.0.0/content/item-debug", "nireader/nireader-fe/2.0.0/template/item/title-debug", "nireader/nireader-fe/2.0.0/template/item/info-debug", "nireader/nireader-fe/2.0.0/template/item/content-debug", "nireader/nireader-fe/2.0.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.0.0/kit/testScroll-debug" ], function(require, exports, module) {
    var URL = require("nireader/nireader-fe/2.0.0/kit/url-debug");
    var Contents = {
        home: require("nireader/nireader-fe/2.0.0/content/home-debug"),
        welcome: require("nireader/nireader-fe/2.0.0/content/entrance-debug"),
        channel: require("nireader/nireader-fe/2.0.0/content/channel-debug"),
        item: require("nireader/nireader-fe/2.0.0/content/item-debug")
    };
    var createContent = function(opt) {
        var type = opt.type || URL.parse(opt.url).type || "home";
        var Content = Contents[type];
        return Content ? new Content(opt) : null;
    };
    module.exports = createContent;
});

define("nireader/nireader-fe/2.0.0/content/home-debug", [ "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/notice-debug", "nireader/nireader-fe/2.0.0/kit/userinfo-debug", "nireader/nireader-fe/2.0.0/kit/cookie-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug", "nireader/nireader-fe/2.0.0/template/home/title-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/home/info-debug", "nireader/nireader-fe/2.0.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.0.0/template/home/recommendList-debug", "nireader/nireader-fe/2.0.0/template/home/channelInfo-debug" ], function(require, exports, module) {
    var resource = require("nireader/nireader-fe/2.0.0/kit/resource-debug");
    var request = require("nireader/nireader-fe/2.0.0/kit/request-debug");
    var notice = require("nireader/nireader-fe/2.0.0/kit/notice-debug");
    var userinfo = require("nireader/nireader-fe/2.0.0/kit/userinfo-debug");
    var eventList = require("nireader/nireader-fe/2.0.0/kit/eventList-debug");
    var customEvent = require("nireader/nireader-fe/2.0.0/kit/customEvent-debug");
    var interfaces = require("nireader/nireader-fe/2.0.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var genHomeTitle = require("nireader/nireader-fe/2.0.0/template/home/title-debug");
    var genHomeInfo = require("nireader/nireader-fe/2.0.0/template/home/info-debug");
    var genSubscriptionList = require("nireader/nireader-fe/2.0.0/template/home/subscriptionList-debug");
    var genRecommendList = require("nireader/nireader-fe/2.0.0/template/home/recommendList-debug");
    var genChannelInfo = require("nireader/nireader-fe/2.0.0/template/home/channelInfo-debug");
    var pageTitle = $("title");
    var Home = function(opt) {
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        this.eventList = eventList.create("content/home");
        this.type = "home";
    };
    Home.prototype.init = function() {
        userinfo.isLogin(function(isIn) {
            if (!isIn) {
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
    Home.prototype.bindEvent = function() {
        var _this = this;
        this.eventList.add(customEvent, "userInfoUpdate", function() {
            _this.refreshSubscriptionList();
        });
    };
    Home.prototype.clean = function() {
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.sideContent.html("");
        this.doms.sideBlock.clearQueue().stop().hide();
        this.doms.leftLink.attr("href", "").show();
        this.doms.rightLink.attr("href", "").show();
        this.doms.topLink.attr("href", "").show();
    };
    Home.prototype.prepareInfo = function() {
        var _this = this;
        _this.data = {};
        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find("#middle-block"),
            title: _this.wrapper.find("#title"),
            info: _this.wrapper.find("#info"),
            content: _this.wrapper.find("#content"),
            sideBlock: _this.wrapper.find("#side-block"),
            sideContent: _this.wrapper.find("#side-content"),
            leftLink: _this.wrapper.find("#left-link"),
            rightLink: _this.wrapper.find("#right-link"),
            topLink: _this.wrapper.find("#top-link")
        };
        _this.sideBlock = _this.genSideBlock();
    };
    Home.prototype.initDoms = function() {};
    Home.prototype.genSideBlock = function() {
        var _this = this;
        var hideTimer, middleBlock = _this.doms.middleBlock, sideBlock = _this.doms.sideBlock, sideContent = _this.doms.sideContent;
        var loading = function() {
            sideBlock.addClass("loading");
        };
        var load = function(cnt) {
            sideBlock.removeClass("loading");
            sideContent.html(cnt);
        };
        var position = function(li) {
            var top = li.offset().top + middleBlock.scrollTop();
            var originTop = parseInt(sideBlock.css("top"), 10);
            sideBlock.stop().clearQueue().show().delay(200).animate({
                top: (top * 6 - originTop) / 5
            }, 100).animate({
                top: top
            }, 50);
        };
        var hide = function() {
            hideTimer = setTimeout(function() {
                sideBlock.hide();
            }, 200);
        };
        var stopHide = function() {
            if (hideTimer) {
                hideTimer = clearTimeout(hideTimer);
            }
        };
        var subscribe = function(cid, icon) {
            icon.addClass("icon-spinner icon-spin");
            request.post({
                subscribee: cid
            }, apis.subscription.add, function(err, subscription) {
                icon.removeClass("icon-spinner icon-spin");
                if (err) {
                    notice("订阅失败");
                    console.warn(err);
                } else {
                    icon.addClass("icon-eye-open").removeClass("icon-eye-close");
                    _this.refreshSubscriptionList();
                }
            });
        };
        var cancelSubscribe = function(cid, icon) {
            icon.addClass("icon-spinner icon-spin");
            request.post({
                subscribee: cid
            }, apis.subscription.remove, function(err, subscription) {
                icon.removeClass("icon-spinner icon-spin");
                if (err) {
                    notice("取消订阅失败");
                    console.warn(err);
                } else {
                    icon.addClass("icon-eye-close").removeClass("icon-eye-open");
                    _this.refreshSubscriptionList();
                    hide();
                }
            });
        };
        var bindSubscribe = function(cid) {
            var icon = sideBlock.find("#channel-subscribed");
            _this.eventList.add(icon, "click", function(e) {
                (icon.hasClass("icon-eye-open") ? cancelSubscribe : subscribe)(cid, icon);
            });
        };
        var getInfoAndRender = function() {
            stopHide();
            var $this = $(this);
            var cid = $this.attr("data-id");
            sideBlock.attr("data-cid", cid);
            position($this);
            loading();
            resource.get("channel", {
                id: cid
            }, function(err, channel) {
                if (sideBlock.attr("data-cid") != cid) {
                    return;
                }
                if (err) {
                    load("Get channel info failed.");
                    return;
                }
                for (var i = _this.data.subscriptions.length - 1; i >= 0; i--) {
                    if (_this.data.subscriptions[i].id == channel.id) {
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
        var bind = function(list) {
            _this.eventList.add(list.find(".item"), "mouseenter", getInfoAndRender);
            _this.eventList.add(list, "mouseleave", hide);
        };
        _this.eventList.add(sideBlock, "mouseenter", stopHide);
        _this.eventList.add(sideBlock, "mouseleave", hide);
        //channel-subscribed
        return {
            bind: bind
        };
    };
    Home.prototype.getUserInfo = function() {
        var _this = this;
        resource.get("user", {}, function(err, user) {
            if (err) {
                console.error(err || "Can not get user info.");
                return;
            }
            _this.dealUserInfo(user);
        });
    };
    Home.prototype.dealUserInfo = function(user) {
        this.data.user = user;
        this.renderHomeInfo({
            user: user
        });
    };
    Home.prototype.dealLinks = function() {
        this.doms.topLink.hide();
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };
    Home.prototype.getSubscriptionListByPage = function(page) {
        var _this = this;
        resource.makeList("subscription", {}, function(err, subscriptions) {
            if (err) {
                console.error(err);
                return;
            }
            _this.data.subscriptionListPage = page;
            _this.dealSubscriptionList(subscriptions);
        })(page);
    };
    Home.prototype.getAllSubscriptionList = function(refresh) {
        var _this = this;
        resource.makeList("subscription", {}, function(err, subscriptions) {
            if (err) {
                console.error(err);
                return;
            }
            _this.dealSubscriptionList(subscriptions);
        }, null, null, refresh)({});
    };
    Home.prototype.refreshSubscriptionList = function() {
        this.doms.subscriptionList && this.doms.subscriptionList.remove();
        //this.getSubscriptionListByPage(this.data.subscriptionListPage);
        this.getAllSubscriptionList(true);
    };
    Home.prototype.dealSubscriptionList = function(subscriptions) {
        this.data.subscriptions = subscriptions;
        this.renderSubscriptionList({
            subscriptions: subscriptions
        });
    };
    Home.prototype.getRecommendList = function() {
        var _this = this;
        resource.makeList("channel", {}, function(err, recommends) {
            if (err) {
                console.error(err);
                return;
            }
            _this.dealRecommendList(recommends);
        })(1);
    };
    Home.prototype.dealRecommendList = function(recommends) {
        this.data.recommends = recommends;
        this.renderRecommendList({
            recommends: recommends
        });
    };
    Home.prototype.renderHomeInfo = function(data) {
        pageTitle.text(data.user.name + "'s reader");
        this.doms.title.html(genHomeTitle(data));
        this.doms.info.html(genHomeInfo(data));
    };
    Home.prototype.renderSubscriptionList = function(data) {
        if (this.recommendListReady) {
            this.doms.content.prepend(genSubscriptionList(data));
        } else {
            this.doms.content.html(genSubscriptionList(data));
        }
        this.subscriptionListReady = true;
        this.doms.subscriptionList = this.doms.content.find("#subscription-list");
        this.sideBlock.bind(this.doms.subscriptionList);
    };
    Home.prototype.renderRecommendList = function(data) {
        if (this.subscriptionListReady) {
            this.doms.content.append(genRecommendList(data));
        } else {
            this.doms.content.html(genRecommendList(data));
        }
        this.recommendListReady = true;
        this.doms.recommendList = this.doms.content.find("#recommend-list");
        this.sideBlock.bind(this.doms.recommendList);
    };
    module.exports = Home;
});

define("nireader/nireader-fe/2.0.0/kit/resource-debug", [ "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/interface/index-debug" ], function(require, exports, module) {
    var request = require("nireader/nireader-fe/2.0.0/kit/request-debug");
    var cache = require("nireader/nireader-fe/2.0.0/kit/cache-debug");
    var formatUrl = require("nireader/nireader-fe/2.0.0/kit/url-debug").format;
    var apis = require("nireader/nireader-fe/2.0.0/interface/index-debug").api;
    var cacheLifetime = {
        resource: 1e3 * 60 * 60,
        // 1h
        list: 1e3 * 60
    };
    var resources = [ "item", "channel" ];
    var getUrl = {
        item: apis.item.get,
        channel: apis.channel.get,
        user: apis.user.get
    };
    var getSort = {
        item: {
            order: "pubDate",
            descrease: true
        },
        channel: {
            order: "id",
            descrease: false
        },
        user: {
            order: "name",
            descrease: false
        }
    };
    var refreshResource = function(type, opt, callback, sort) {
        if (!type || typeof type !== "string") {
            return;
        }
        var cacheKey = {
            type: type,
            opt: opt,
            sort: sort
        };
        var params = {
            opt: opt,
            sort: sort || getSort[type]
        };
        var url = getUrl[type];
        request.get(params, url, function(err, resource) {
            if (!err) {
                cache.set(cacheKey, resource, cacheLifetime.resource);
            }
            callback && callback(err, resource);
        });
    };
    var getResource = function(type, opt, callback, sort, refresh) {
        if (!type || typeof type !== "string") {
            return;
        }
        var cachedResult, cacheKey = {
            cache: "resource",
            type: type,
            opt: opt,
            sort: sort
        };
        if (!refresh && (cachedResult = cache.get(cacheKey))) {
            callback && callback(null, cachedResult);
            return;
        }
        var params = {
            opt: opt,
            sort: sort || getSort[type]
        };
        var url = getUrl[type];
        request.get(params, url, function(err, resource) {
            if (!err) {
                cache.set(cacheKey, resource, cacheLifetime.resource);
            }
            callback && callback(err, resource);
        });
    };
    var makeGet = function(type, callback) {
        return function(opt) {
            return getResource(type, opt, callback);
        };
    };
    var listUrl = {
        item: apis.item.list,
        channel: apis.channel.list,
        subscription: apis.subscription.list
    };
    var listFields = {
        item: [ "id", "pubDate", "title", "source" ],
        channel: [ "id", "pubDate", "title" ],
        subscription: [ "channel.id", "channel.pubDate", "channel.title", "channel.description", "channel.generator" ]
    };
    var listSort = {
        item: {
            order: "pubDate",
            descrease: true
        },
        channel: {
            order: "id",
            descrease: false
        },
        subscription: {
            order: "channel.id",
            descrease: false
        }
    };
    var listNumInPage = {
        item: 20,
        channel: 20,
        subscription: 20
    };
    var listResource = function(type, opt, page, callback, sort, fields, refresh) {
        if (!type || typeof type !== "string") {
            return;
        }
        var cachedResult, cacheKey = {
            cache: "list",
            type: type,
            opt: opt,
            sort: sort
        };
        if (!refresh && (cachedResult = cache.get(cacheKey))) {
            callback && callback(null, cachedResult);
            return;
        }
        var numInPage = listNumInPage[type];
        var limit;
        if (typeof page === "object") {
            limit = page;
        }
        var params = {
            opt: opt,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit: limit || (numInPage ? {
                from: numInPage * (page - 1),
                num: numInPage
            } : null)
        };
        var url = listUrl[type];
        request.get(params, url, function(err, list) {
            if (!err) {
                cache.set(cacheKey, list, cacheLifetime.list);
            }
            callback && callback(err, list);
        });
    };
    var makeCertainList = function(type, opt, callback, sort, fields, refresh) {
        return function(page) {
            return listResource(type, opt, page, callback, sort, fields, refresh);
        };
    };
    var searchUrl = {
        item: apis.item.search,
        channel: apis.channel.search,
        subscription: apis.subscription.search
    };
    var searchResource = function(type, keywords, page, callback, sort, fields) {
        if (!type || typeof type !== "string") {
            return;
        }
        var numInPage = listNumInPage[type];
        var limit;
        if (typeof page === "object") {
            limit = page;
        }
        var params = {
            keywords: keywords,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit: limit || (numInPage ? {
                from: numInPage * (page - 1),
                num: numInPage
            } : null)
        };
        var url = searchUrl[type];
        request.get(params, url, callback);
    };
    var makeCertainSearch = function(type, opt, callback, sort, fields) {
        return function(page) {
            return searchResource(type, opt, page, callback, sort, fields);
        };
    };
    exports.refresh = refreshResource;
    exports.get = getResource;
    exports.list = listResource;
    exports.search = searchResource;
    exports.makeList = makeCertainList;
    exports.makeSearch = makeCertainSearch;
});

define("nireader/nireader-fe/2.0.0/kit/request-debug", [], function(require, exports, module) {
    var maxRepeatNum = 3;
    var doRequest = function(type, data, url, callback, repeat) {
        if (typeof data === "string") {
            repeat = callback;
            callback = url;
            url = data;
            data = null;
        }
        $.ajax(url, {
            data: data,
            type: type,
            dataType: "json",
            headers: {
                isAjax: true
            },
            success: function(res) {
                callback && callback(res.err, res.data);
            },
            error: function(err) {
                if (repeat === true) {
                    repeat = maxRepeatNum;
                }
                if (typeof repeat === "number" && repeat > 0) {
                    doRequest(type, data, url, callback, --repeat);
                } else {
                    callback && callback(err, null);
                }
            }
        });
    };
    exports.post = function(data, url, callback, repeat) {
        doRequest("post", data, url, callback, repeat);
    };
    exports.get = function(data, url, callback, repeat) {
        doRequest("get", data, url, callback, repeat);
    };
});

define("nireader/nireader-fe/2.0.0/kit/cache-debug", [ "nireader/nireader-fe/2.0.0/config-debug" ], function(require, exports, module) {
    var config = require("nireader/nireader-fe/2.0.0/config-debug").cache;
    var autoManageInterval = config.manageInterval;
    var defaultLifetime = config.lifetime;
    var maxCacheNum = config.maxNum;
    // temporarily use array to record hot list
    // todo: use sth more effective instead, such as heap
    var storage = {};
    var hotList = [];
    var timer;
    var cacheStatus = function() {
        window.LOG.apply(window, arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            window.LOG("storage: ", storage, "hotList: ", hotList);
            timer = null;
        }, 10);
    };
    var touch = function(name, remove) {
        var pos = hotList.indexOf(name);
        if (pos >= 0) {
            hotList.splice(pos, 1);
        }
        if (!remove) {
            hotList.push(name);
        }
    };
    var set = function(name, obj, lifetime) {
        name = JSON.stringify(name);
        obj = JSON.stringify(obj);
        touch(name);
        cacheStatus("cache: ", name);
        storage[name] = {
            cnt: obj,
            doom: Date.now() + (lifetime || defaultLifetime)
        };
    };
    var get = function(name) {
        name = JSON.stringify(name);
        var obj = storage[name];
        cacheStatus((obj ? "catch" : "miss") + " in cache: ", name);
        if (obj) {
            touch(name);
            return JSON.parse(obj.cnt);
        }
    };
    var remove = function(name) {
        name = JSON.stringify(name);
        touch(name, true);
        cacheStatus("remove cache: ", name);
        return delete storage[name];
    };
    var manage = function() {
        cacheStatus("manage cache...");
        var now = Date.now();
        for (var name in storage) {
            if (storage.hasOwnProperty(name)) {
                if (now > storage[name].doom) {
                    touch(name, true);
                    cacheStatus("cache expired: ", name);
                    delete storage[name];
                }
            }
        }
        var overNum = hotList.length - maxCacheNum;
        for (var i = 0, name; i < overNum; i++) {
            name = hotList[i];
            cacheStatus("cache over num: ", name);
            delete storage[name];
        }
        hotList = hotList.slice(overNum, hotList.length);
        cacheStatus("manage cache end.");
    };
    var autoManage = function() {
        setInterval(manage, autoManageInterval);
    };
    autoManage();
    module.exports = {
        set: set,
        get: get
    };
});

define("nireader/nireader-fe/2.0.0/config-debug", [], function(require, exports, module) {
    module.exports = {
        cache: {
            manageInterval: 1e3 * 60 * 1,
            // 1min
            lifetime: 1e3 * 60 * 1,
            // 1min
            maxNum: 200
        }
    };
});

define("nireader/nireader-fe/2.0.0/interface/index-debug", [], function(require, exports, module) {
    var api = {
        channel: {
            get: "/api/channel",
            list: "/api/list/channel",
            search: "/api/search/channel",
            create: "/api/channel/create",
            save: "/api/channel/save"
        },
        item: {
            get: "/api/item",
            list: "/api/list/item",
            search: "/api/search/item"
        },
        subscription: {
            get: "/api/subscription",
            list: "/api/list/subscription",
            add: "/api/subscription/add",
            remove: "/api/subscription/remove"
        },
        user: {
            get: "/api/user"
        },
        auth: {
            "in": "/api/signin",
            out: "/api/signout"
        }
    };
    var page = {
        home: "/",
        entrance: "/welcome",
        channel: function(id) {
            return "/channel/" + id;
        },
        item: function(id) {
            return "/item/" + id;
        }
    };
    module.exports = {
        api: api,
        page: page
    };
});

define("nireader/nireader-fe/2.0.0/kit/notice-debug", [], function(require, exports, module) {
    module.exports = function(word) {
        if (typeof word !== "string") {
            word = JSON.stringify(word);
        }
        console.log(word);
    };
});

define("nireader/nireader-fe/2.0.0/kit/userinfo-debug", [ "nireader/nireader-fe/2.0.0/kit/cookie-debug" ], function(require, exports, module) {
    var cookie = require("nireader/nireader-fe/2.0.0/kit/cookie-debug");
    var identityKey = "WhoAmI";
    var isLogin = function(callback) {
        callback && callback(!!cookie.get(identityKey));
    };
    var getUserinfo = function(callback) {};
    module.exports = {
        isLogin: isLogin
    };
});

define("nireader/nireader-fe/2.0.0/kit/cookie-debug", [], function(require, exports, module) {
    var isValidKey = function(key) {
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string
        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>
        return new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key);
    };
    var getRawCookie = function(key) {
        if (isValidKey(key)) {
            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"), result = reg.exec(document.cookie);
            if (result) {
                return result[2] || null;
            }
        }
        return null;
    };
    var getCookie = function(key) {
        var value = getRawCookie(key);
        if ("string" == typeof value) {
            value = decodeURIComponent(value);
            return value;
        }
        return null;
    };
    exports.get = getCookie;
});

define("nireader/nireader-fe/2.0.0/kit/eventList-debug", [], function(require, exports, module) {
    var lists = {};
    window.lists = lists;
    //------------------------
    var create = function(name) {
        name += (Math.random() + "").slice(2);
        var list = lists[name] = [];
        LOG("create eventList: ", name);
        return {
            name: name,
            list: list,
            add: function(dom, event, handler) {
                LOG("add event: ", event, " to ", this);
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].dom === dom && list[i].event === event && list[i].handler === handler) {
                        return;
                    }
                }
                try {
                    dom.on(event, handler);
                    list.push({
                        dom: dom,
                        event: event,
                        handler: handler
                    });
                } catch (e) {
                    console.log(e.stack);
                }
                return list;
            },
            remove: function(dom, event, handler) {
                LOG("remove event: ", event, " from ", this);
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].dom === dom && list[i].event === event && list[i].handler === handler) {
                        try {
                            dom.off(event, handler);
                            list.splice(i, 1);
                        } catch (e) {
                            console.log(e.stack);
                        }
                        break;
                    }
                }
            },
            clean: function() {
                LOG("clean eventList: ", this);
                for (var i = list.length - 1, record; i >= 0; i--) {
                    try {
                        record = list[i];
                        record.dom.off(record.event, record.handler);
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
                list = lists[name] = [];
                delete lists[name];
            }
        };
    };
    module.exports = {
        create: create
    };
});

define("nireader/nireader-fe/2.0.0/template/home/title-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<%=user.name%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/template-debug", [ "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var formatTime = require("nireader/nireader-fe/2.0.0/kit/time-debug").format;
    template.helper("formatTime", formatTime);
    module.exports = template;
});

define("nireader/nireader-fe/2.0.0/kit/time-debug", [ "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var toLength = require("nireader/nireader-fe/2.0.0/kit/num-debug").toLength;
    var getTodayBegin = function() {
        var t = new Date();
        t.setMilliseconds(0);
        t.setSeconds(0);
        t.setMinutes(0);
        t.setHours(0);
        return t;
    };
    var thisYear = new Date().getFullYear();
    var todayBegin = getTodayBegin();
    var update = setInterval(function() {
        thisYear = new Date().getFullYear();
        todayBegin = getTodayBegin();
    }, 60 * 1e3);
    var daysAgo = function(t, i) {
        var time = new Date(t.valueOf());
        time.setDate(time.getDate() - i);
        return time;
    };
    var dayList = [ "今天", "昨天", "天前" ];
    var numList = [ "零", "一", "两", "三", "四", "五" ];
    var formatDateTime = function(t) {
        if (t > todayBegin) {
            return dayList[0];
        } else if (t > daysAgo(todayBegin, 1)) {
            return dayList[1];
        } else {
            for (var i = 2; i <= 5; i++) {
                if (t > daysAgo(todayBegin, i)) {
                    return numList[i] + dayList[2];
                }
            }
            var str = "";
            var y = t.getFullYear();
            var m = toLength(t.getMonth() + 1, 2);
            var d = toLength(t.getDate(), 2);
            if (y !== thisYear) {
                str += y + "年";
            }
            str += m + "月" + d + "日";
            return str;
        }
    };
    var formatDayTime = function(t) {
        return toLength(t.getHours(), 2) + ":" + toLength(t.getMinutes(), 2);
    };
    var format = function(time, seperator) {
        var t = new Date(time);
        seperator = seperator === undefined ? "" : seperator;
        return formatDateTime(t) + seperator + formatDayTime(t);
    };
    exports.formatDate = formatDateTime;
    exports.formatDay = formatDayTime;
    exports.format = format;
});

define("nireader/nireader-fe/2.0.0/kit/num-debug", [], function(require, exports, module) {
    var toLength = function(num, l) {
        var str = (num + "").slice(0, l);
        if (str.length < l) {
            for (var i = str.length; i < l; i++) {
                str = "0" + str;
            }
        }
        return str;
    };
    var format = function(num, n) {
        if (typeof n !== "number" || n < 1) {
            n = 1;
        }
        var s = num.toFixed(n);
        var pattern1 = /[0]+$/;
        var pattern2 = /\.$/;
        return s.replace(pattern1, "").replace(pattern2, "");
    };
    var random = function(min, max) {
        min = min || 0;
        max = max || 100;
        var r = Math.random() * (max - min);
        return Math.floor(r + min);
    };
    exports.toLength = toLength;
    exports.format = format;
    exports.random = random;
});

define("nireader/nireader-fe/2.0.0/template/home/info-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<% if(user.description){ %>" + '<span class="mr20 ml150" title="<%=user.description%>">' + "<%=user.description%>" + "</span>" + "<% } %>" + "<% if(user.homepage){ %>" + '<a class="mr20" href="<%=user.homepage%>" target="_blank" title="页面">' + "SITE" + "</a>" + "<% } %>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/home/subscriptionList-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<ul id="subscription-list" class="item-list">' + "<%if(subscriptions && subscriptions.length > 0){%>" + '<h6 class="sub-title">' + "Subscriptions: " + "</h6>" + "<%for(i = 0; i < subscriptions.length; i ++) {%>" + '<li class="item" data-id="<%=subscriptions[i].id%>">' + '<a data-link-async="true" href="/channel/<%=subscriptions[i].id%>">' + "<%=subscriptions[i].title%>" + "</a>" + '<span class="pubdate">' + '<%="更新于" + formatTime(subscriptions[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "<%}else{%>" + '<h6 class="sub-title">' + "No subscription yet, " + "</h6>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/home/recommendList-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<h6 class="sub-title">' + "Here are some recommends:" + "</h6>" + '<ul id="recommend-list" class="item-list">' + "<%for(i = 0; i < recommends.length; i ++) {%>" + '<li class="item" data-id="<%=recommends[i].id%>">' + '<a data-link-async="true" href="/channel/<%=recommends[i].id%>">' + "<%=recommends[i].title%>" + "</a>" + '<span class="pubdate">' + '<%="更新于" + formatTime(recommends[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/home/channelInfo-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<h3 class="channel-title">' + "<%=channel.title%>" + '<i id="channel-subscribed" ' + 'class="icon-eye-<%=channel.subscribed?"open":"close"%>" ' + 'title="<%=channel.subscribed?"已订阅":"未订阅"%>"></i>' + "</h3>" + '<p class="channel-description">' + "<%=channel.description%>" + "</p>" + '<p class="channel-generator">' + "<%=channel.generator%>" + "</p>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/content/entrance-debug", [ "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug", "nireader/nireader-fe/2.0.0/kit/notice-debug", "nireader/nireader-fe/2.0.0/kit/userinfo-debug", "nireader/nireader-fe/2.0.0/kit/cookie-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/interface/index-debug" ], function(require, exports, module) {
    var request = require("nireader/nireader-fe/2.0.0/kit/request-debug");
    var customEvent = require("nireader/nireader-fe/2.0.0/kit/customEvent-debug");
    var notice = require("nireader/nireader-fe/2.0.0/kit/notice-debug");
    var userinfo = require("nireader/nireader-fe/2.0.0/kit/userinfo-debug");
    var eventList = require("nireader/nireader-fe/2.0.0/kit/eventList-debug");
    var interfaces = require("nireader/nireader-fe/2.0.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var pageTitle = $("title");
    var goHome = function() {
        customEvent.trigger("goto", pages.home);
    };
    var Entrance = function(opt) {
        this.url = opt.url;
        //this.wrapper = opt.wrapper;
        this.eventList = eventList.create("content/entrance");
        this.type = "entrance";
    };
    Entrance.prototype.init = function() {
        userinfo.isLogin(function(isIn) {
            if (isIn) {
                goHome();
            }
        });
        this.prepareInfo();
        pageTitle.text("Welcome");
        this.dealLinks();
        this.bindEvent();
    };
    Entrance.prototype.dealLinks = function() {
        this.doms.topLink.hide();
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };
    Entrance.prototype.bindEvent = function() {
        var _this = this;
        var doms = this.doms;
        this.eventList.add(doms.signin, "click", function() {
            doms.signinBlock.fadeIn();
            return false;
        });
        this.eventList.add(doms.submit, "click", function(e) {
            _this.signIn();
        });
        this.eventList.add(doms.passwordIN, "keyup", function(e) {
            if (e.which === 13) {
                // Enter
                _this.signIn();
            }
        });
    };
    Entrance.prototype.signIn = function() {
        var username = this.doms.nameIn.val();
        var password = this.doms.passwordIN.val();
        if (!username || !password) {
            return;
        }
        request.post({
            username: username,
            password: password
        }, apis.auth.in, function(err, data) {
            if (err) {
                notice(err);
                return;
            }
            goHome();
        });
    };
    Entrance.prototype.clean = function() {
        this.eventList.clean();
        this.doms.wrapper.animate({
            marginTop: -this.doms.wrapper.height() + "px"
        }, 1e3, function() {
            $(this).hide();
        });
    };
    Entrance.prototype.prepareInfo = function() {
        this.doms = {
            wrapper: $("#header"),
            leftLink: $("#left-link"),
            rightLink: $("#right-link"),
            topLink: $("#top-link"),
            signin: $("#signin"),
            signinBlock: $("#signin-block"),
            nameIn: $("#name-in"),
            passwordIN: $("#password-in"),
            submit: $("#submit")
        };
    };
    module.exports = Entrance;
});

define("nireader/nireader-fe/2.0.0/content/channel-debug", [ "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/kit/userinfo-debug", "nireader/nireader-fe/2.0.0/kit/cookie-debug", "nireader/nireader-fe/2.0.0/template/channel/title-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/channel/info-debug", "nireader/nireader-fe/2.0.0/template/channel/itemList-debug" ], function(require, exports, module) {
    var resource = require("nireader/nireader-fe/2.0.0/kit/resource-debug");
    var pagePath = require("nireader/nireader-fe/2.0.0/interface/index-debug").page;
    var URL = require("nireader/nireader-fe/2.0.0/kit/url-debug");
    var eventList = require("nireader/nireader-fe/2.0.0/kit/eventList-debug");
    var userinfo = require("nireader/nireader-fe/2.0.0/kit/userinfo-debug");
    var genChannelTitle = require("nireader/nireader-fe/2.0.0/template/channel/title-debug");
    var genChannelInfo = require("nireader/nireader-fe/2.0.0/template/channel/info-debug");
    var genItemList = require("nireader/nireader-fe/2.0.0/template/channel/itemList-debug");
    var pageTitle = $("title");
    var Channel = function(opt) {
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        this.eventList = eventList.create("content/channel");
        this.type = "channel";
    };
    Channel.prototype.init = function() {
        this.prepareInfo();
        this.getItemListByPage(1);
        this.getChannelInfo();
        var _this = this;
        userinfo.isLogin(function(isIn) {
            if (isIn) {
                _this.getNeighbourInfo();
            } else {
                _this.dealNoUserinfo();
            }
        });
        this.bindEvent();
    };
    Channel.prototype.bindEvent = function() {};
    Channel.prototype.clean = function() {
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.sideContent.html("");
        this.doms.sideBlock.clearQueue().stop().hide();
        this.doms.leftLink.attr("href", "");
        this.doms.rightLink.attr("href", "");
        this.doms.topLink.attr("href", "");
    };
    Channel.prototype.prepareInfo = function() {
        var _this = this;
        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10)
        };
        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find("#middle-block"),
            title: _this.wrapper.find("#title"),
            info: _this.wrapper.find("#info"),
            content: _this.wrapper.find("#content"),
            sideBlock: _this.wrapper.find("#side-block"),
            sideContent: _this.wrapper.find("#side-content"),
            leftLink: _this.wrapper.find("#left-link"),
            rightLink: _this.wrapper.find("#right-link"),
            topLink: _this.wrapper.find("#top-link")
        };
        _this.getItemListByPage = resource.makeList("item", {
            source: _this.data.id
        }, function(err, items) {
            if (err) {
                console.error(err);
                return;
            }
            _this.dealItemList(items);
        });
    };
    Channel.prototype.getChannelInfo = function() {
        var _this = this;
        resource.get("channel", {
            id: _this.data.id
        }, function(err, channel) {
            if (err) {
                console.error(err || "No such channel");
                return;
            }
            _this.dealChannelInfo(channel);
        });
    };
    Channel.prototype.dealChannelInfo = function(channel) {
        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };
    Channel.prototype.getNeighbourInfo = function() {
        var _this = this;
        resource.list("subscription", null, {
            from: 0
        }, function(err, channels) {
            if (err || channels.length < 1) {
                console.error(err || "Get aside channel info fail.");
                return;
            }
            var pos = -1;
            for (var i = 0, l = channels.length; i < l; i++) {
                if (parseInt(channels[i].id, 10) === _this.data.id) {
                    pos = i;
                    break;
                }
            }
            _this.dealNeighbourInfo({
                prev: channels[pos - 1],
                next: channels[pos + 1]
            });
        });
    };
    Channel.prototype.dealNeighbourInfo = function(neighbours) {
        this.doms.topLink.attr("href", pagePath.home).attr("title", "Home");
        if (neighbours.prev) {
            this.doms.leftLink.attr("href", pagePath.channel(neighbours.prev.id)).attr("title", neighbours.prev.title).show();
        } else {
            this.doms.leftLink.hide();
        }
        if (neighbours.next) {
            this.doms.rightLink.attr("href", pagePath.channel(neighbours.next.id)).attr("title", neighbours.next.title).show();
        } else {
            this.doms.rightLink.hide();
        }
    };
    Channel.prototype.dealNoUserinfo = function() {
        this.doms.topLink.attr("href", pagePath.home).attr("title", "Home");
        this.doms.leftLink.hide();
        this.doms.rightLink.hide();
    };
    Channel.prototype.dealItemList = function(items) {
        this.data.items = items;
        this.renderItemList({
            items: items
        });
    };
    Channel.prototype.renderChannelInfo = function(data) {
        this.doms.title.html(genChannelTitle(data));
        this.doms.info.html(genChannelInfo(data));
        pageTitle.text(data.channel.title);
    };
    Channel.prototype.sideBlockLoading = function() {
        this.doms.sideBlock.addClass("loading");
    };
    Channel.prototype.sideBlockLoad = function(cnt) {
        this.doms.sideBlock.removeClass("loading");
        this.doms.sideContent.html(cnt);
    };
    Channel.prototype.sideBlockGoto = function(li) {
        var top = li.offset().top + this.doms.middleBlock.scrollTop();
        var originTop = parseInt(this.doms.sideBlock.css("top"), 10);
        this.doms.sideBlock.stop().clearQueue().show().delay(200).animate({
            top: (top * 6 - originTop) / 5
        }, 100).animate({
            top: top
        }, 50);
    };
    Channel.prototype.renderItemList = function(data) {
        var _this = this;
        _this.doms.content.html(genItemList(data));
        var timer;
        this.eventList.add(_this.doms.content.find(".item"), "mouseenter", function() {
            if (timer) {
                timer = clearTimeout(timer);
            }
            var $this = $(this);
            var iid = parseInt($this.attr("data-id"), 10);
            _this.doms.sideBlock.attr("data-iid", iid);
            _this.sideBlockGoto($this);
            _this.sideBlockLoading();
            resource.get("item", {
                id: iid
            }, function(err, item) {
                if (_this.doms.sideBlock.attr("data-iid") != iid) {
                    return;
                }
                if (err) {
                    _this.sideBlockLoad("Get item info failed.");
                    return;
                }
                _this.sideBlockLoad(item.content);
            });
        });
        this.eventList.add(_this.doms.content, "mouseleave", function() {
            timer = setTimeout(function() {
                _this.doms.sideBlock.hide();
            }, 200);
        });
    };
    module.exports = Channel;
});

define("nireader/nireader-fe/2.0.0/template/channel/title-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<%=channel.title%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/channel/info-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<% if(channel.description){ %>" + '<span class="mr20 ml150" title="<%=channel.description%>">' + "<%=channel.description%>" + "</span>" + "<% } %>" + '<span class="mr20">' + "@ <%=formatTime(channel.pubDate)%>" + "</span>" + '<a class="mr20" href="<%=channel.link%>" target="_blank" title="访问网站">' + "SITE" + "</a>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/channel/itemList-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<ul class="item-list">' + "<%for(i = 0; i < items.length; i ++) {%>" + '<li class="item" data-id="<%=items[i].id%>">' + '<a data-link-async="true" href="/item/<%=items[i].id%>">' + "<%=items[i].title%>" + "</a>" + '<span class="pubdate">' + '<%=formatTime(items[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/content/item-debug", [ "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/eventList-debug", "nireader/nireader-fe/2.0.0/template/item/title-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/item/info-debug", "nireader/nireader-fe/2.0.0/template/item/content-debug", "nireader/nireader-fe/2.0.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.0.0/kit/testScroll-debug" ], function(require, exports, module) {
    var resource = require("nireader/nireader-fe/2.0.0/kit/resource-debug");
    var pagePath = require("nireader/nireader-fe/2.0.0/interface/index-debug").page;
    var URL = require("nireader/nireader-fe/2.0.0/kit/url-debug");
    var eventList = require("nireader/nireader-fe/2.0.0/kit/eventList-debug");
    var genItemTitle = require("nireader/nireader-fe/2.0.0/template/item/title-debug");
    var genItemInfo = require("nireader/nireader-fe/2.0.0/template/item/info-debug");
    var genItemContent = require("nireader/nireader-fe/2.0.0/template/item/content-debug");
    var genItemChannelTitle = require("nireader/nireader-fe/2.0.0/template/item/channelTitle-debug");
    var pageTitle = $("title");
    var testScroll = require("nireader/nireader-fe/2.0.0/kit/testScroll-debug");
    var testBottom = testScroll.bottom;
    var testTop = testScroll.top;
    var Item = function(opt) {
        this.url = opt.url;
        this.wrapper = opt.wrapper;
        this.eventList = eventList.create("content/item");
        this.type = "item";
    };
    Item.prototype.init = function() {
        var _this = this;
        _this.prepareInfo();
        _this.getItemInfo(function() {
            _this.getChannelInfo();
            _this.getNeighbourInfo(function() {
                _this.preloadNeighbours();
            });
        });
        _this.bindEvent();
    };
    Item.prototype.bindEvent = function() {
        var data = this.data;
        var middleBlock = this.doms.middleBlock;
        var leftLink = this.doms.leftLink;
        var rightLink = this.doms.rightLink;
        var checkoutDelay = 300;
        var addEvent = this.eventList.add, removeEvent = this.eventList.remove;
        var topScroll = function(e, delta, deltaX, deltaY) {
            if (deltaY > 0) {
                leftLink.css("display") !== "none" && leftLink.click();
            }
        };
        var bottomScroll = function(e, delta, deltaX, deltaY) {
            if (deltaY < 0) {
                rightLink.css("display") !== "none" && rightLink.click();
            }
        };
        var initScroll = true;
        addEvent(middleBlock, "mousewheel", function(e, delta, deltaX, deltaY) {
            removeEvent(middleBlock, "mousewheel", topScroll);
            removeEvent(middleBlock, "mousewheel", bottomScroll);
            if (initScroll) {
                initScroll = false;
                return;
            }
            if (deltaY > 0 && testTop(middleBlock)) {
                data.timer1 = data.timer1 || setTimeout(function() {
                    addEvent(middleBlock, "mousewheel", topScroll);
                    data.timer1 = null;
                }, checkoutDelay);
            }
            if (deltaY < 0 && testBottom(middleBlock)) {
                data.timer2 = data.timer2 || setTimeout(function() {
                    addEvent(middleBlock, "mousewheel", bottomScroll);
                    data.timer2 = null;
                }, checkoutDelay);
            }
        });
    };
    Item.prototype.clean = function() {
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        clearTimeout(this.data.timer);
        clearTimeout(this.data.timer1);
        clearTimeout(this.data.timer2);
        this.doms.leftLink.attr("href", "");
        this.doms.rightLink.attr("href", "");
        this.doms.topLink.attr("href", "");
    };
    Item.prototype.prepareInfo = function() {
        var _this = this;
        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10)
        };
        _this.doms = {
            wrapper: _this.wrapper,
            middleBlock: _this.wrapper.find("#middle-block"),
            title: _this.wrapper.find("#title"),
            info: _this.wrapper.find("#info"),
            content: _this.wrapper.find("#content"),
            leftLink: _this.wrapper.find("#left-link"),
            rightLink: _this.wrapper.find("#right-link"),
            topLink: _this.wrapper.find("#top-link")
        };
    };
    Item.prototype.getItemInfo = function(callback) {
        var _this = this;
        resource.get("item", {
            id: _this.data.id
        }, function(err, item) {
            if (err) {
                console.error(err || "No such item");
                return;
            }
            _this.dealItemInfo(item);
            callback && callback();
        });
    };
    Item.prototype.getChannelInfo = function() {
        var _this = this;
        resource.get("channel", {
            id: _this.data.item.source
        }, function(err, channel) {
            if (err) {
                console.error(err || "Can not get channel");
                return;
            }
            _this.dealChannelInfo(channel);
        });
    };
    // 预读取相邻文章内容到缓存中
    Item.prototype.preloadNeighbours = function() {
        var neighbour;
        if (neighbour = this.data.neighbours.prev) {
            resource.get("item", {
                id: neighbour.id
            });
        }
        if (neighbour = this.data.neighbours.next) {
            resource.get("item", {
                id: neighbour.id
            });
        }
    };
    Item.prototype.dealItemInfo = function(item) {
        this.data.item = item;
        this.renderItemInfo({
            item: item
        });
    };
    Item.prototype.dealChannelInfo = function(channel) {
        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };
    Item.prototype.getNeighbourInfo = function(callback) {
        var _this = this;
        resource.list("item", {
            source: _this.data.item.source
        }, {
            from: 0
        }, function(err, items) {
            if (err || items.length < 1) {
                console.error(err || "Get aside item info fail.");
                return;
            }
            var pos = -1;
            for (var i = 0, l = items.length; i < l; i++) {
                if (parseInt(items[i].id, 10) === _this.data.id) {
                    pos = i;
                    break;
                }
            }
            _this.dealNeighbourInfo({
                prev: items[pos - 1],
                next: items[pos + 1]
            });
            callback && callback();
        });
    };
    Item.prototype.dealNeighbourInfo = function(neighbours) {
        this.data.neighbours = neighbours;
        if (neighbours.prev) {
            this.doms.leftLink.attr("href", pagePath.item(neighbours.prev.id)).attr("title", neighbours.prev.title).show();
        } else {
            this.doms.leftLink.hide();
        }
        if (neighbours.next) {
            this.doms.rightLink.attr("href", pagePath.item(neighbours.next.id)).attr("title", neighbours.next.title).show();
        } else {
            this.doms.rightLink.hide();
        }
    };
    Item.prototype.renderItemInfo = function(data) {
        pageTitle.text(data.item.title);
        this.doms.title.html(genItemTitle(data));
        this.doms.info.html(genItemInfo(data));
        this.doms.content.html(genItemContent(data));
        this.doms.topLink.attr("href", pagePath.channel(data.item.source));
    };
    Item.prototype.renderChannelInfo = function(data) {
        this.doms.topLink.attr("title", data.channel.title);
        this.doms.info.prepend(genItemChannelTitle(data));
    };
    module.exports = Item;
});

define("nireader/nireader-fe/2.0.0/template/item/title-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<%=item.title%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/item/info-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<span class="mr40">' + "@ <%=formatTime(item.pubDate)%>" + "</span>" + '<a class="mr40" href="<%=item.link%>" target="_blank" title="原文">' + "ORIGIN" + "</a>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/item/content-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = "<%==item.content%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/item/channelTitle-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<span class="">' + "From " + '<a href="/channel/<%=channel.id%>" title="<%=channel.description%>" data-link-async=true >' + "<%=channel.title%> " + "</a>" + "</span>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/kit/testScroll-debug", [], function(require, exports, module) {
    exports.bottom = function(dom) {
        // if a jquery obj
        dom = dom[0] || dom;
        return dom && dom.scrollTop + dom.clientHeight >= dom.scrollHeight;
    };
    exports.top = function(dom) {
        // if a jquery obj
        dom = dom[0] || dom;
        return dom && dom.scrollTop <= 0;
    };
});

define("nireader/nireader-fe/2.0.0/module/floater-debug", [ "nireader/nireader-fe/2.0.0/kit/keypress-debug", "nireader/nireader-fe/2.0.0/kit/pattern-debug", "nireader/nireader-fe/2.0.0/kit/request-debug", "nireader/nireader-fe/2.0.0/kit/resource-debug", "nireader/nireader-fe/2.0.0/kit/cache-debug", "nireader/nireader-fe/2.0.0/config-debug", "nireader/nireader-fe/2.0.0/kit/url-debug", "nireader/nireader-fe/2.0.0/interface/index-debug", "nireader/nireader-fe/2.0.0/kit/notice-debug", "nireader/nireader-fe/2.0.0/kit/customEvent-debug", "nireader/nireader-fe/2.0.0/template/common/result-debug", "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug", "nireader/nireader-fe/2.0.0/template/common/tip-debug", "nireader/nireader-fe/2.0.0/template/common/loadingIcon-debug" ], function(require, exports, module) {
    var keypress = require("nireader/nireader-fe/2.0.0/kit/keypress-debug");
    var pattern = require("nireader/nireader-fe/2.0.0/kit/pattern-debug");
    var request = require("nireader/nireader-fe/2.0.0/kit/request-debug");
    var resource = require("nireader/nireader-fe/2.0.0/kit/resource-debug");
    var notice = require("nireader/nireader-fe/2.0.0/kit/notice-debug");
    var URL = require("nireader/nireader-fe/2.0.0/kit/url-debug");
    var customEvent = require("nireader/nireader-fe/2.0.0/kit/customEvent-debug");
    var interfaces = require("nireader/nireader-fe/2.0.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var genResult = require("nireader/nireader-fe/2.0.0/template/common/result-debug");
    var genTip = require("nireader/nireader-fe/2.0.0/template/common/tip-debug");
    var loadingIcon = require("nireader/nireader-fe/2.0.0/template/common/loadingIcon-debug")();
    var bodyContent = $("#body");
    var globalFloater = $("#floater");
    var globalInput = $("#input");
    var globalTip = $("#tips");
    var globalResult = $("#results");
    var currVal;
    var initInfo = function() {
        currVal = globalInput.val().trim();
    };
    var initDom = function() {
        globalInput.val("").focus();
        checkInput();
        globalTip.hide();
        globalResult.hide();
    };
    var showFloater = function() {
        bodyContent.addClass("blur");
        globalFloater.addClass("show");
        initDom();
        initInfo();
    };
    //showFloater();
    var hideFloater = function() {
        bodyContent.removeClass("blur");
        globalFloater.removeClass("show");
    };
    var toggleFloater = function() {
        if (globalFloater.hasClass("show")) {
            hideFloater();
        } else {
            showFloater();
        }
    };
    var reloadPage = function() {
        customEvent.trigger("userInfoUpdate");
    };
    var cleanResult = function() {
        globalResult.html("").hide();
    };
    var cleanTip = function() {
        globalTip.html("").hide();
    };
    var cleanAll = function() {
        cleanTip();
        cleanResult();
    };
    var addTip = function(word) {
        globalTip.show().prepend(genTip({
            tip: {
                word: word
            }
        }));
    };
    var showTip = function(word) {
        cleanTip();
        addTip(word);
    };
    var addResult = function(word, link, async) {
        link = link || "javascript:;";
        var target = URL.isSameDomain(link) ? "" : "_blank";
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
    var createChannel = function(url, callback) {
        request.post({
            url: url
        }, apis.channel.create, callback);
    };
    var saveChannel = function(channel, callback) {
        request.post({
            channel: channel
        }, apis.channel.save, callback);
    };
    var addSubscription = function(cid, callback) {
        request.post({
            subscribee: cid,
            description: ""
        }, apis.subscription.add, callback);
    };
    var dealFeed = function() {
        var url = globalInput.val();
        showTip("A feed url? parsing... " + loadingIcon);
        createChannel(url, function(err, channel) {
            if (url !== currVal) {
                return;
            }
            cleanAll();
            if (err) {
                showTip("Failed to parse, invalid feed url.");
                return;
            }
            var exist = !!channel.id;
            showTip("Press <b>Enter</b> to " + (exist ? "" : "add & ") + "subscribe.");
            addResult(channel.title, exist ? pages.channel(channel.id) : channel.link, exist);
            enterHandler = function() {
                saveChannel(channel, function(err, channel) {
                    if (err) {
                        showTip("Failed to add channel. Please try again.");
                        return;
                    }
                    showTip("Channel " + channel.title + " added, subscribing... " + loadingIcon);
                    addSubscription(channel.id, function(err, subscription) {
                        if (err) {
                            showTip("Failed to subscribe channel " + channel.title + ". Please try again.");
                            return;
                        }
                        cleanResult();
                        showTip("Channel " + channel.title + " subscribed.");
                        reloadPage();
                    });
                });
            };
        });
    };
    var dealLogout = function() {
        showTip("Press <b>Enter</b> to logout.");
        enterHandler = function() {
            showTip("logout ing... " + loadingIcon);
            request.get(apis.auth.out, function(err) {
                if (err) {
                    notice(err);
                    return;
                }
                location.href = pages.home;
            });
        };
    };
    var dealHome = function() {
        showTip("Press <b>Enter</b> to go to home ('/').");
        enterHandler = function() {
            showTip("going to home... " + loadingIcon);
            customEvent.trigger("goto", "/");
            cleanTip();
        };
    };
    var doSearch = function(val) {
        if (val) {
            var keywords = val.split(" "), realKeywords = [];
            for (var i = 0, l = keywords.length; i < l; i++) {
                if (keywords[i]) {
                    realKeywords.push(keywords[i]);
                }
            }
            if (!realKeywords.length) {
                return;
            }
            //addTip('searching... ' + loadingIcon);
            resource.search("channel", realKeywords, 1, function(err, channels) {
                if (val !== currVal) {
                    return;
                }
                if (!err) {
                    for (var i = 0, l = channels.length; i < l; i++) {
                        addResult(channels[i].title, pages.channel(channels[i].id), true);
                    }
                }
            });
        }
    };
    var cmds = {
        logout: dealLogout,
        home: dealHome
    };
    var checkInput = function() {
        var val = globalInput.val().trim();
        // No change
        if (val == currVal) {
            return;
        } else {
            currVal = val;
        }
        // Clean result
        cleanAll();
        // CMD
        if (val && cmds[val]) {
            cmds[val]();
            return;
        }
        // Feed url
        if (val && pattern.url.test(val)) {
            dealFeed();
            return;
        }
        // CMD hint
        var pos, str, cmd;
        if (val) {
            for (var c in cmds) {
                if (cmds.hasOwnProperty(c) && (pos = c.indexOf(val)) >= 0) {
                    cmd = c;
                    str = c.slice(0, pos) + "<b>" + val + "</b>" + c.slice(pos + val.length) + "	 ---- Use <b>Tab</b>";
                    addTip(str);
                }
            }
        }
        tabHandler = cmd && function(e) {
            globalInput.val(cmd);
        };
        // Search for channels
        doSearch(val);
    };
    globalInput.on("keydown", function(e) {
        // Tab
        if (e.which === 9) {
            e.preventDefault();
            if (tabHandler && !tabHandler(e)) {
                return;
            }
        }
    });
    globalInput.on("keyup", function(e) {
        // Enter
        if (e.which === 13) {
            if (enterHandler && !enterHandler(e)) {
                globalInput.val("");
                return;
            }
        }
        checkInput();
    });
    keypress.register(27, function(e) {
        toggleFloater();
    });
});

define("nireader/nireader-fe/2.0.0/kit/keypress-debug", [], function(require, exports, module) {
    var eventList = {};
    var format = function(which, ctrl, alt) {
        var str = which + "";
        str += ctrl ? "+ctrl" : "";
        str += alt ? "+alt" : "";
        return str;
    };
    var register = function(which, handler, ctrl, alt) {
        var name = format(which, ctrl, alt);
        eventList[name] = eventList[name] || [];
        eventList[name].push(handler);
    };
    var trigger = function(which, ctrl, alt, e) {
        var name = format(which, ctrl, alt);
        if (eventList[name]) {
            var list = eventList[name];
            for (var i = 0, l = list.length; i < l; i++) {
                try {
                    list[i](e);
                } catch (e) {}
            }
        }
    };
    $("body").on("keyup", function(e) {
        //console.log(e.which, e.ctrlKey, e.altKey, e);//--------------------------------------
        trigger(e.which, e.ctrlKey, e.altKey, e);
        e.preventDefault();
        return false;
    });
    module.exports = {
        register: register,
        trigger: trigger
    };
});

define("nireader/nireader-fe/2.0.0/kit/pattern-debug", [], function(require, exports, module) {
    var urlPattern = /[a-z]+\:\/\/[\w]+\.[\w]+/;
    module.exports = {
        url: urlPattern
    };
});

define("nireader/nireader-fe/2.0.0/template/common/result-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<li class="result">' + '<a href="<%=result.link%>" target="<%=result.target%>" ' + '<%=result.async?"data-link-async=true":""%>>' + "<%==result.word%>" + "</a>" + "</li>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/common/tip-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<li class="tip">' + "<%==tip.word%>" + "</li>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.0.0/template/common/loadingIcon-debug", [ "nireader/nireader-fe/2.0.0/template/template-debug", "nireader/nireader-fe/2.0.0/kit/time-debug", "nireader/nireader-fe/2.0.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.0.0/template/template-debug");
    var tmpl = '<i class="icon-spinner icon-spin" style="' + "<% if(size){ %>" + "font-size:<%=size*2%>px;" + "<% } %>" + '"></i>';
    var render = template.compile(tmpl);
    module.exports = function(data) {
        data = data || {};
        return render(data);
    };
});
