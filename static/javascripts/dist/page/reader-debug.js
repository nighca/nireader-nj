define("nireader/nireader-fe/2.1.0/page/reader-debug", [ "../module/stateManager-debug", "../kit/url-debug", "../kit/customEvent-debug", "../module/page-debug", "../module/createContent-debug", "../content/home-debug", "../kit/resource-debug", "../kit/request-debug", "../kit/cache-debug", "../kit/local-debug", "../config-debug", "../interface/index-debug", "../kit/notice-debug", "../template/common/notice-debug", "../template/template-debug", "../kit/time-debug", "../kit/num-debug", "../kit/effect-debug", "../template/common/loader-debug", "../kit/userinfo-debug", "../kit/cookie-debug", "../kit/eventList-debug", "../template/home/title-debug", "../template/home/info-debug", "../template/home/subscriptionList-debug", "../template/home/recommendList-debug", "../template/home/channelInfo-debug", "../content/entrance-debug", "../template/common/loadingIcon-debug", "../content/channel-debug", "../module/floater-debug", "../kit/keypress-debug", "../kit/pattern-debug", "../template/common/result-debug", "../template/common/tip-debug", "../template/channel/title-debug", "../template/channel/info-debug", "../template/channel/itemList-debug", "../content/item-debug", "../template/item/title-debug", "../template/item/info-debug", "../template/item/content-debug", "../template/item/channelTitle-debug", "../kit/testScroll-debug", "../module/task-debug", "../module/tasks/logger-debug", "../module/tasks/cacheManager-debug", "../module/tasks/breath-debug" ], function(require, exports, module) {
    var stateManager = require("../module/stateManager-debug");
    var page = require("../module/page-debug");
    var floater = require("../module/floater-debug");
    var task = require("../module/task-debug").add(require("../module/tasks/logger-debug")).add(require("../module/tasks/cacheManager-debug")).add(require("../module/tasks/breath-debug")).run();
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

define("nireader/nireader-fe/2.1.0/module/stateManager-debug", [ "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug" ], function(require, exports, module) {
    var formatUrl = require("nireader/nireader-fe/2.1.0/kit/url-debug").format;
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
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
            if (history.pushState) {
                manager.pushState({
                    url: url,
                    title: "Loading"
                });
                manager.checkout();
            } else {
                location.href = url;
            }
        };
        $("body").delegate("[data-link-async]", "click", function(e) {
            var link = $(this);
            if (link.attr("disabled") || !link.attr("href")) {
                return false;
            }
            if (!e.ctrlKey) {
                e.preventDefault();
                gotoUrl(link.attr("href"));
            } else {}
        });
        customEvent.on("goto", gotoUrl);
        customEvent.on("goback", function(e) {
            history.back();
        });
        var onpopstate = window.onpopstate = function(e) {
            manager.checkout();
        };
        // do checkout while page loaded (chrome trigger popstate automatically)
        if (navigator.userAgent.toLowerCase().indexOf("chrome") < 0) {
            setTimeout(onpopstate, 0);
        }
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

define("nireader/nireader-fe/2.1.0/kit/url-debug", [], function(require, exports, module) {
    var withProtocal = function(url) {
        return url.indexOf("://") > 0;
    };
    var getOrigin = function() {
        return location.origin || [ location.protocol, "//", location.hostname, location.port || "" ].join("");
    };
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
        var pattern = /\/([\w]*)(\/([\w]+))?($|\?|\#)/;
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
        if (url.indexOf(getOrigin()) === 0) {
            return true;
        }
        return false;
    };
    var complete = function(url) {
        return withProtocal(url) ? url : getOrigin() + concatWithCurrentPath(url);
    };
    var parseHash = function(hash) {
        var hashParams = {};
        var e, a = /\+/g, // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g, d = function(s) {
            return decodeURIComponent(s.replace(a, " "));
        }, q = hash.substring(1);
        while (e = r.exec(q)) hashParams[d(e[1])] = d(e[2]);
        return hashParams;
    };
    exports.format = formatUrl;
    //exports.getType = getType;
    exports.parse = parseUrl;
    exports.isSameDomain = isSameDomain;
    exports.complete = complete;
    exports.parseHash = parseHash;
});

define("nireader/nireader-fe/2.1.0/kit/customEvent-debug", [], function(require, exports, module) {
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

define("nireader/nireader-fe/2.1.0/module/page-debug", [ "nireader/nireader-fe/2.1.0/module/createContent-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/content/home-debug", "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/template/home/title-debug", "nireader/nireader-fe/2.1.0/template/home/info-debug", "nireader/nireader-fe/2.1.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.1.0/template/home/recommendList-debug", "nireader/nireader-fe/2.1.0/template/home/channelInfo-debug", "nireader/nireader-fe/2.1.0/content/entrance-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug", "nireader/nireader-fe/2.1.0/content/channel-debug", "nireader/nireader-fe/2.1.0/module/floater-debug", "nireader/nireader-fe/2.1.0/kit/keypress-debug", "nireader/nireader-fe/2.1.0/kit/pattern-debug", "nireader/nireader-fe/2.1.0/template/common/result-debug", "nireader/nireader-fe/2.1.0/template/common/tip-debug", "nireader/nireader-fe/2.1.0/template/channel/title-debug", "nireader/nireader-fe/2.1.0/template/channel/info-debug", "nireader/nireader-fe/2.1.0/template/channel/itemList-debug", "nireader/nireader-fe/2.1.0/content/item-debug", "nireader/nireader-fe/2.1.0/template/item/title-debug", "nireader/nireader-fe/2.1.0/template/item/info-debug", "nireader/nireader-fe/2.1.0/template/item/content-debug", "nireader/nireader-fe/2.1.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.1.0/kit/testScroll-debug" ], function(require, exports, module) {
    var createContent = require("nireader/nireader-fe/2.1.0/module/createContent-debug");
    var URL = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug");
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
        notice.clean();
        if (this.content) {
            this.content.clean();
        }
        this.content = null;
    };
    page.checkout = function(info) {
        var _this = this;
        _this.clean();
        setTimeout(function() {
            _this.init();
        }, 0);
    };
    module.exports = page;
});

define("nireader/nireader-fe/2.1.0/module/createContent-debug", [ "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/content/home-debug", "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/template/home/title-debug", "nireader/nireader-fe/2.1.0/template/home/info-debug", "nireader/nireader-fe/2.1.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.1.0/template/home/recommendList-debug", "nireader/nireader-fe/2.1.0/template/home/channelInfo-debug", "nireader/nireader-fe/2.1.0/content/entrance-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug", "nireader/nireader-fe/2.1.0/content/channel-debug", "nireader/nireader-fe/2.1.0/module/floater-debug", "nireader/nireader-fe/2.1.0/kit/keypress-debug", "nireader/nireader-fe/2.1.0/kit/pattern-debug", "nireader/nireader-fe/2.1.0/template/common/result-debug", "nireader/nireader-fe/2.1.0/template/common/tip-debug", "nireader/nireader-fe/2.1.0/template/channel/title-debug", "nireader/nireader-fe/2.1.0/template/channel/info-debug", "nireader/nireader-fe/2.1.0/template/channel/itemList-debug", "nireader/nireader-fe/2.1.0/content/item-debug", "nireader/nireader-fe/2.1.0/template/item/title-debug", "nireader/nireader-fe/2.1.0/template/item/info-debug", "nireader/nireader-fe/2.1.0/template/item/content-debug", "nireader/nireader-fe/2.1.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.1.0/kit/testScroll-debug" ], function(require, exports, module) {
    var URL = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var Contents = {
        home: require("nireader/nireader-fe/2.1.0/content/home-debug"),
        welcome: require("nireader/nireader-fe/2.1.0/content/entrance-debug"),
        channel: require("nireader/nireader-fe/2.1.0/content/channel-debug"),
        item: require("nireader/nireader-fe/2.1.0/content/item-debug")
    };
    var createContent = function(opt) {
        var type = opt.type || URL.parse(opt.url).type || "home";
        var Content = Contents[type];
        return Content ? new Content(opt) : null;
    };
    module.exports = createContent;
});

define("nireader/nireader-fe/2.1.0/content/home-debug", [ "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/template/home/title-debug", "nireader/nireader-fe/2.1.0/template/home/info-debug", "nireader/nireader-fe/2.1.0/template/home/subscriptionList-debug", "nireader/nireader-fe/2.1.0/template/home/recommendList-debug", "nireader/nireader-fe/2.1.0/template/home/channelInfo-debug" ], function(require, exports, module) {
    var resource = require("nireader/nireader-fe/2.1.0/kit/resource-debug");
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug").notice;
    var userinfo = require("nireader/nireader-fe/2.1.0/kit/userinfo-debug");
    var eventList = require("nireader/nireader-fe/2.1.0/kit/eventList-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var effect = require("nireader/nireader-fe/2.1.0/kit/effect-debug");
    var interfaces = require("nireader/nireader-fe/2.1.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var genHomeTitle = require("nireader/nireader-fe/2.1.0/template/home/title-debug");
    var genHomeInfo = require("nireader/nireader-fe/2.1.0/template/home/info-debug");
    var genSubscriptionList = require("nireader/nireader-fe/2.1.0/template/home/subscriptionList-debug");
    var genRecommendList = require("nireader/nireader-fe/2.1.0/template/home/recommendList-debug");
    var genChannelInfo = require("nireader/nireader-fe/2.1.0/template/home/channelInfo-debug");
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
        effect.bodyLoading();
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
                    notice("没订阅成");
                    LOG(err);
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
                    notice("没能取消订阅");
                    LOG(err);
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
        resource.makeList("subscription", null, function(err, subscriptions) {
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
        resource.makeList("subscription", null, function(err, subscriptions) {
            if (err) {
                console.error(err);
                return;
            }
            _this.dealSubscriptionList(subscriptions);
        }, null, null, refresh)();
    };
    Home.prototype.refreshSubscriptionList = function() {
        this.doms.subscriptionList && this.doms.subscriptionList.remove();
        //this.getSubscriptionListByPage(this.data.subscriptionListPage);
        this.getAllSubscriptionList(true);
    };
    Home.prototype.dealSubscriptionList = function(subscriptions) {
        subscriptions.map(function(subscription) {
            subscription.pageUrl = pages.myChannel(subscription.id);
            return subscription;
        });
        this.data.subscriptions = subscriptions;
        this.renderSubscriptionList({
            subscriptions: subscriptions
        });
    };
    Home.prototype.getRecommendList = function() {
        var _this = this;
        resource.makeList("channel", null, function(err, recommends) {
            if (err) {
                console.error(err);
                return;
            }
            _this.dealRecommendList(recommends);
        }, {
            order: "score",
            descrease: true
        })(1);
    };
    Home.prototype.dealRecommendList = function(recommends) {
        recommends.map(function(recommend) {
            recommend.pageUrl = pages.recommendChannel(recommend.id);
            return recommend;
        });
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
        effect.bodyUnloading();
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
        var p = 20;
        this.doms.recommendList.children().each(function(i, li) {
            $(li).css("opacity", (p - i) / p);
        });
        this.sideBlock.bind(this.doms.recommendList);
    };
    module.exports = Home;
});

define("nireader/nireader-fe/2.1.0/kit/resource-debug", [ "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/interface/index-debug" ], function(require, exports, module) {
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var cache = require("nireader/nireader-fe/2.1.0/kit/cache-debug");
    var formatUrl = require("nireader/nireader-fe/2.1.0/kit/url-debug").format;
    var apis = require("nireader/nireader-fe/2.1.0/interface/index-debug").api;
    var config = require("nireader/nireader-fe/2.1.0/config-debug").resource;
    var cacheLifetime = config.lifetime;
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
            cache: "resource",
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
        subscription: [ "channel.id", "channel.pubDate", "channel.title" ]
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
        if (!page) {
            limit = null;
        } else if (typeof page === "object") {
            limit = page;
        } else {
            limit = numInPage ? {
                from: numInPage * (page - 1),
                num: numInPage
            } : null;
        }
        var params = {
            opt: opt,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit: limit
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

define("nireader/nireader-fe/2.1.0/kit/request-debug", [], function(require, exports, module) {
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

define("nireader/nireader-fe/2.1.0/kit/cache-debug", [ "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug" ], function(require, exports, module) {
    var local = require("nireader/nireader-fe/2.1.0/kit/local-debug").create("cache");
    var config = require("nireader/nireader-fe/2.1.0/config-debug").cache;
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
    var clear = function() {
        LOG("clear begin: ", storage);
        storage = {};
        hotList = [];
        local.clear();
        LOG("clear end: ", storage);
    };
    var getSize = function() {
        return local.getSize();
    };
    // persistence with localStorage
    var saveToLocal = function() {
        LOG("save to local begin: ", storage);
        local.clear();
        for (var name in storage) {
            if (storage.hasOwnProperty(name)) {
                local.set(name, JSON.stringify(storage[name]));
            }
        }
        LOG("save to local: ", storage);
        setTimeout(function() {
            LOG("local size: ", local.getSize());
        }, 100);
    };
    var loadFromLocal = function() {
        LOG("load from local begin: ", storage);
        var all = local.getAll();
        var item;
        var now = Date.now();
        for (var name in all) {
            if (all.hasOwnProperty(name)) {
                item = JSON.parse(all[name]);
                if (now < item.doom) {
                    storage[name] = item;
                }
            }
        }
        LOG("load from local: ", storage);
    };
    window.storage = storage;
    window.local = local;
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
        saveToLocal();
        cacheStatus("manage cache end.");
    };
    window.onbeforeunload = function() {
        saveToLocal();
    };
    loadFromLocal();
    module.exports = {
        set: set,
        get: get,
        clear: clear,
        getSize: getSize,
        manage: manage
    };
});

define("nireader/nireader-fe/2.1.0/kit/local-debug", [], function(require, exports, module) {
    var encodeKey = function(key, domain) {
        return domain + "$" + key;
    };
    var decodeKey = function(key, domain) {
        return key.slice(domain.length + 1);
    };
    var isInDomain = function(key, domain) {
        return !domain || key.indexOf(domain + "$") === 0;
    };
    var set = function(domain, key, val) {
        key = encodeKey(key, domain);
        try {
            return localStorage[key] = val;
        } catch (e) {
            LOG("set localStorage error: ", e);
            return null;
        }
    };
    var get = function(domain, key) {
        key = encodeKey(key, domain);
        return localStorage[key];
    };
    var remove = function(domain, key) {
        key = encodeKey(key, domain);
        localStorage.removeItem(key);
    };
    var getAll = function(domain) {
        var all = {};
        for (var i = 0, l = localStorage.length, key, val; i < l; i++) {
            key = localStorage.key(i);
            if (key && isInDomain(key, domain)) {
                val = localStorage[key];
                all[decodeKey(key, domain)] = val;
            }
        }
        return all;
    };
    var clear = function(domain) {
        for (var i = localStorage.length - 1, key, val; i >= 0; i--) {
            key = localStorage.key(i);
            if (key && isInDomain(key, domain)) {
                localStorage.removeItem(key);
            }
        }
    };
    var getSize = function(domain) {
        var num = 0, size = 0;
        for (var i = 0, l = localStorage.length, key, val; i < l; i++) {
            key = localStorage.key(i);
            if (key && isInDomain(key, domain)) {
                num++;
                val = localStorage[key];
                size += key.length + val.length;
            }
        }
        var B = size * 2;
        var KB = B / 1024;
        var MB = KB / 1024;
        return {
            num: num,
            length: size,
            B: B,
            KB: KB.toFixed(2),
            MB: MB.toFixed(2)
        };
    };
    var create = function(domain) {
        return {
            get: function(key) {
                return get(domain, key);
            },
            remove: function(key) {
                return remove(domain, key);
            },
            set: function(key, val) {
                return set(domain, key, val);
            },
            getAll: function() {
                return getAll(domain);
            },
            clear: function() {
                return clear(domain);
            },
            getSize: function() {
                return getSize(domain);
            }
        };
    };
    module.exports = {
        create: create
    };
});

define("nireader/nireader-fe/2.1.0/config-debug", [], function(require, exports, module) {
    module.exports = {
        cache: {
            manageInterval: 1e3 * 60 * 1,
            // 1min
            lifetime: 1e3 * 60 * 10,
            // 10min
            maxNum: 100
        },
        resource: {
            lifetime: {
                resource: 1e3 * 60 * 60 * 24,
                // 1day
                list: 1e3 * 60 * 60
            }
        },
        auth: {
            qq: {
                clientId: "100544244",
                scope: "get_user_info"
            }
        }
    };
});

define("nireader/nireader-fe/2.1.0/interface/index-debug", [], function(require, exports, module) {
    var api = {
        channel: {
            get: "/api/channel",
            list: "/api/list/channel",
            search: "/api/search/channel",
            create: "/api/channel/create",
            save: "/api/channel/save",
            vote: "/api/channel/vote"
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
        },
        myChannel: function(id) {
            return "/my/channel/" + id;
        },
        myItem: function(id) {
            return "/my/item/" + id;
        },
        recommendChannel: function(id) {
            return "/recommend/channel/" + id;
        },
        recommendItem: function(id) {
            return "/recommend/item/" + id;
        },
        auth: {
            qq: {
                auth: "https://graph.qq.com/oauth2.0/authorize",
                callback: "/auth/qq",
                getId: "https://graph.qq.com/oauth2.0/me"
            }
        }
    };
    module.exports = {
        api: api,
        page: page
    };
});

define("nireader/nireader-fe/2.1.0/kit/notice-debug", [ "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug" ], function(require, exports, module) {
    var genNotice = require("nireader/nireader-fe/2.1.0/template/common/notice-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var effect = require("nireader/nireader-fe/2.1.0/kit/effect-debug");
    var noticeBlock = $("#notice");
    var visible = false;
    var showNotice = function() {
        if (visible) {
            return;
        }
        effect.bodyBlur();
        effect.headerBlur();
        effect.floaterBlur();
        noticeBlock.show();
        visible = true;
    };
    var hideNotice = function() {
        if (!visible) {
            return;
        }
        effect.bodyUnblur();
        effect.headerUnblur();
        effect.floaterUnblur();
        noticeBlock.hide();
        visible = false;
    };
    var clean = function() {
        noticeBlock.html("");
    };
    var render = function(word) {
        if (typeof word == "object") {
            word = JSON.stringify(word);
        }
        var notice = {
            word: word
        };
        noticeBlock.html(genNotice({
            notice: notice
        }));
        showNotice();
    };
    var bind = function(callback) {
        noticeBlock.find("#confirm").on("click", function() {
            hideNotice();
            callback && callback();
        });
    };
    var renderAndBind = function(word, callback) {
        render(word);
        bind(callback);
    };
    var cleanAndHide = function() {
        clean();
        hideNotice();
    };
    module.exports = {
        clean: cleanAndHide,
        notice: renderAndBind,
        visible: function() {
            return visible;
        },
        NotFound: function() {
            renderAndBind("走错地方了。", function() {
                customEvent.trigger("goback");
            });
        }
    };
});

define("nireader/nireader-fe/2.1.0/template/common/notice-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<p class="word">' + "<%==notice.word%>" + "</p>" + '<p class="op">' + '<button id="confirm">嗯</button>' + "</p>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/template-debug", [ "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var formatTime = require("nireader/nireader-fe/2.1.0/kit/time-debug").format;
    template.helper("formatTime", formatTime);
    module.exports = template;
});

define("nireader/nireader-fe/2.1.0/kit/time-debug", [ "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var toLength = require("nireader/nireader-fe/2.1.0/kit/num-debug").toLength;
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
        if (time === null || time === undefined) {
            return "我所不知道的某一天";
        }
        var t = new Date(time);
        seperator = seperator === undefined ? "" : seperator;
        return formatDateTime(t) + seperator + formatDayTime(t);
    };
    exports.formatDate = formatDateTime;
    exports.formatDay = formatDayTime;
    exports.format = format;
});

define("nireader/nireader-fe/2.1.0/kit/num-debug", [], function(require, exports, module) {
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

define("nireader/nireader-fe/2.1.0/kit/effect-debug", [ "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var body = $("#body");
    var header = $("#header");
    var floater = $("#floater");
    $("body").prepend(require("nireader/nireader-fe/2.1.0/template/common/loader-debug")());
    var loader = $("#loader");
    // counter to simulate multi-layer effect
    var counter = {};
    var reduceCounter = function(name) {
        counter[name] = counter[name] || 0;
        counter[name] = counter[name] > 0 ? counter[name] - 1 : 0;
        return counter[name];
    };
    var increaseCounter = function(name) {
        counter[name] = counter[name] || 0;
        counter[name]++;
        return counter[name];
    };
    var clearCounter = function(name) {
        counter[name] = 0;
        return counter[name];
    };
    var getCounter = function(name) {
        return counter[name];
    };
    // effects
    var bodyBlur = function() {
        increaseCounter("bodyBlur");
        body.addClass("blur");
        bodyTransparent();
    };
    var bodyUnblur = function(clear) {
        if (!(clear ? clearCounter : reduceCounter)("bodyBlur")) {
            body.removeClass("blur");
        }
        bodyUntransparent(clear);
    };
    var bodyLoading = function() {
        increaseCounter("bodyLoading");
        loader.show();
        bodyBlur();
    };
    var bodyUnloading = function(clear) {
        if (!(clear ? clearCounter : reduceCounter)("bodyLoading")) {
            loader.hide();
        }
        // 此处有bug！！！
        bodyUnblur(clear);
    };
    var headerBlur = function() {
        increaseCounter("headerBlur");
        header.addClass("blur");
    };
    var headerUnblur = function(clear) {
        if (!(clear ? clearCounter : reduceCounter)("headerBlur")) {
            header.removeClass("blur");
        }
    };
    var floaterBlur = function() {
        increaseCounter("floaterBlur");
        floater.addClass("blur");
    };
    var floaterUnblur = function(clear) {
        if (!(clear ? clearCounter : reduceCounter)("floaterBlur")) {
            floater.removeClass("blur");
        }
    };
    var bodyTransparent = function() {
        increaseCounter("bodyTransparent");
        body.addClass("half-transparent");
    };
    var bodyUntransparent = function(clear) {
        if (!(clear ? clearCounter : reduceCounter)("bodyTransparent")) {
            body.removeClass("half-transparent");
        }
    };
    window.effect = module.exports = {
        bodyBlur: bodyBlur,
        bodyUnblur: bodyUnblur,
        bodyLoading: bodyLoading,
        bodyUnloading: bodyUnloading,
        headerBlur: headerBlur,
        headerUnblur: headerUnblur,
        floaterBlur: floaterBlur,
        floaterUnblur: floaterUnblur
    };
});

define("nireader/nireader-fe/2.1.0/template/common/loader-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<div id="loader" class="loader" style="' + "<% if(size){ %>" + "width:<%=size%>px;" + "height:<%=size%>px;" + "<% } %>" + '"></div>';
    var render = template.compile(tmpl);
    module.exports = function(data) {
        data = data || {};
        return render(data);
    };
});

define("nireader/nireader-fe/2.1.0/kit/userinfo-debug", [ "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/interface/index-debug" ], function(require, exports, module) {
    var cookie = require("nireader/nireader-fe/2.1.0/kit/cookie-debug");
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var cache = require("nireader/nireader-fe/2.1.0/kit/cache-debug");
    var interfaces = require("nireader/nireader-fe/2.1.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var identityKey = "WhoAmI";
    var isLogin = function(callback) {
        callback && callback(!!cookie.get(identityKey));
    };
    var getUserinfo = function(callback) {};
    var logout = function(callback) {
        request.get(apis.auth.out, function(err) {
            cache.clear();
            callback && callback(err);
        });
    };
    module.exports = {
        isLogin: isLogin,
        logout: logout
    };
});

define("nireader/nireader-fe/2.1.0/kit/cookie-debug", [], function(require, exports, module) {
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

define("nireader/nireader-fe/2.1.0/kit/eventList-debug", [], function(require, exports, module) {
    var lists = {};
    var create = function(name) {
        name += (Math.random() + "").slice(2);
        var list = lists[name] = [];
        LOG("create eventList: ", name);
        return {
            name: name,
            list: list,
            add: function(dom, event, handler) {
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
                    LOG("add event: ", event, " to ", this);
                } catch (e) {
                    console.log(e.stack);
                }
                return list;
            },
            remove: function(dom, event, handler) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].dom === dom && list[i].event === event && list[i].handler === handler) {
                        try {
                            dom.off(event, handler);
                            list.splice(i, 1);
                            LOG("remove event: ", event, " from ", this);
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

define("nireader/nireader-fe/2.1.0/template/home/title-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<%=user.name%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/home/info-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<% if(user.description){ %>" + '<span class="mr20 ml150" title="<%=user.description%>">' + "<%=user.description%>" + "</span>" + "<% } %>" + "<% if(user.homepage){ %>" + '<a class="mr20" href="<%=user.homepage%>" target="_blank" title="站点">' + "站点" + "</a>" + "<% } %>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/home/subscriptionList-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<ul id="subscription-list" class="item-list">' + "<%if(subscriptions && subscriptions.length > 0){%>" + '<h6 class="sub-title">' + "订阅：" + "</h6>" + "<%for(i = 0; i < subscriptions.length; i ++) {%>" + '<li class="item" data-id="<%=subscriptions[i].id%>">' + '<a data-link-async="true" href="<%=subscriptions[i].pageUrl%>">' + "<%=subscriptions[i].title%>" + "</a>" + '<span class="pubdate">' + '<%="更新于" + formatTime(subscriptions[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "<%}else{%>" + '<h6 class="sub-title">' + "没有订阅，" + "</h6>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/home/recommendList-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<h6 class="sub-title">' + "推荐：" + "</h6>" + '<ul id="recommend-list" class="item-list">' + "<%for(i = 0; i < recommends.length; i ++) {%>" + '<li class="item" data-id="<%=recommends[i].id%>">' + '<a data-link-async="true" href="<%=recommends[i].pageUrl%>">' + "<%=recommends[i].title%>" + "</a>" + '<span class="pubdate">' + '<%="更新于" + formatTime(recommends[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/home/channelInfo-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<h3 class="channel-title">' + "<%=channel.title%>" + '<i id="channel-subscribed" ' + 'class="icon-eye-<%=channel.subscribed?"open":"close"%>" ' + 'title="<%=channel.subscribed?"已订阅":"未订阅"%>"></i>' + "</h3>" + '<p class="channel-description">' + "<%=channel.description%>" + "</p>" + '<p class="channel-generator">' + "<%=channel.generator%>" + "</p>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/content/entrance-debug", [ "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug" ], function(require, exports, module) {
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug").notice;
    var userinfo = require("nireader/nireader-fe/2.1.0/kit/userinfo-debug");
    var eventList = require("nireader/nireader-fe/2.1.0/kit/eventList-debug");
    var url = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var interfaces = require("nireader/nireader-fe/2.1.0/interface/index-debug");
    var authConfig = require("nireader/nireader-fe/2.1.0/config-debug").auth;
    var apis = interfaces.api;
    var pages = interfaces.page;
    var loadingIcon = require("nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug")();
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
        var showStatus = function(word, loading) {
            doms.status.html(word + (loading ? " " + loadingIcon : ""));
        };
        /*this.eventList.add(doms.signin, 'click', function(){
            doms.signinBlock.fadeIn();
            return false;
        });*/
        this.eventList.add(doms.qq, "click", function(e) {
            var config = authConfig.qq;
            var authUrl = pages.auth.qq.auth;
            var redirect_uri = encodeURIComponent(url.complete(pages.auth.qq.callback));
            authUrl += "?response_type=" + "token";
            authUrl += "&client_id=" + config.clientId;
            authUrl += "&redirect_uri=" + redirect_uri;
            authUrl += "&scope=" + config.scope;
            showStatus("在新页面中授权");
            window.finishAuth = function(params) {
                var getIdUrl = pages.auth.qq.getId;
                getIdUrl += "?access_token=" + params.access_token;
                window.callback = function(result) {
                    showStatus("登录", true);
                    request.post({
                        username: result.openid,
                        password: params.access_token,
                        thirdParty: "qq"
                    }, apis.auth.in, function(err, data) {
                        if (err) {
                            notice(data);
                            return;
                        }
                        showStatus("登录成功", true);
                        goHome();
                    });
                    delete window.callback;
                };
                var script = document.createElement("script");
                script.src = getIdUrl;
                document.body.appendChild(script);
                showStatus("获取基本信息", true);
                delete window.finishAuth;
            };
            window.open(authUrl);
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
        var status = this.doms.status;
        var showStatus = function(word, loading) {
            status.html(word + (loading ? " " + loadingIcon : ""));
        };
        showStatus("登录", true);
        request.post({
            username: username,
            password: password
        }, apis.auth.in, function(err, data) {
            if (err) {
                notice("错了。");
                return;
            }
            showStatus("登录成功", true);
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
            submit: $("#submit"),
            qq: $("#qq"),
            status: $("#status")
        };
    };
    module.exports = Entrance;
});

define("nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<i class="icon-spinner icon-spin" style="' + "<% if(size){ %>" + "font-size:<%=size*2%>px;" + "<% } %>" + '"></i>';
    var render = template.compile(tmpl);
    module.exports = function(data) {
        data = data || {};
        return render(data);
    };
});

define("nireader/nireader-fe/2.1.0/content/channel-debug", [ "nireader/nireader-fe/2.1.0/module/floater-debug", "nireader/nireader-fe/2.1.0/kit/keypress-debug", "nireader/nireader-fe/2.1.0/kit/pattern-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/template/common/result-debug", "nireader/nireader-fe/2.1.0/template/common/tip-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/template/channel/title-debug", "nireader/nireader-fe/2.1.0/template/channel/info-debug", "nireader/nireader-fe/2.1.0/template/channel/itemList-debug" ], function(require, exports, module) {
    var floater = require("nireader/nireader-fe/2.1.0/module/floater-debug");
    var resource = require("nireader/nireader-fe/2.1.0/kit/resource-debug");
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var interfaces = require("nireader/nireader-fe/2.1.0/interface/index-debug");
    var pagePath = interfaces.page;
    var apiPath = interfaces.api;
    var URL = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var eventList = require("nireader/nireader-fe/2.1.0/kit/eventList-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var effect = require("nireader/nireader-fe/2.1.0/kit/effect-debug");
    var keypress = require("nireader/nireader-fe/2.1.0/kit/keypress-debug");
    var userinfo = require("nireader/nireader-fe/2.1.0/kit/userinfo-debug");
    var genChannelTitle = require("nireader/nireader-fe/2.1.0/template/channel/title-debug");
    var genChannelInfo = require("nireader/nireader-fe/2.1.0/template/channel/info-debug");
    var genItemList = require("nireader/nireader-fe/2.1.0/template/channel/itemList-debug");
    var pageTitle = $("title");
    var inSubscriptionFlag = "/my/";
    var inRecommendFlag = "/recommend/";
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
            } else if (!_this.data.inSubscription) {
                _this.dealNoUserinfo();
            } else {
                customEvent.trigger("goto", _this.url.slice(inSubscriptionFlag.length - 1));
            }
        });
        this.bindEvent();
    };
    Channel.prototype.bindEvent = function() {
        var leftLink = this.doms.leftLink;
        var rightLink = this.doms.rightLink;
        this.eventList.add(keypress, keypress.code.left, function(e) {
            !floater.visible() && leftLink.click();
        });
        this.eventList.add(keypress, keypress.code.right, function(e) {
            !floater.visible() && rightLink.click();
        });
    };
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
        effect.bodyLoading();
    };
    Channel.prototype.prepareInfo = function() {
        var _this = this;
        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10),
            inSubscription: _this.url.indexOf(inSubscriptionFlag) === 0,
            inRecommend: _this.url.indexOf(inRecommendFlag) === 0
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
                if (err.status == 404) {
                    notice.NotFound();
                } else {
                    LOG(err);
                }
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
        var listName = _this.data.inSubscription ? "subscription" : "channel";
        var sort = _this.data.inRecommend ? {
            order: "score",
            descrease: true
        } : null;
        resource.list(listName, null, null, function(err, channels) {
            if (err || channels.length < 1) {
                notice.notice("无法获取频道列表");
                LOG(err);
                return;
            }
            var pos = -1;
            for (var i = 0, l = channels.length; i < l; i++) {
                if (parseInt(channels[i].id, 10) === _this.data.id) {
                    pos = i;
                    break;
                }
            }
            if (pos === -1) {
                if (_this.data.inSubscription) {
                    customEvent.trigger("goto", _this.url.slice(inSubscriptionFlag.length - 1));
                } else {
                    notice.NotFound();
                }
                return;
            }
            _this.dealNeighbourInfo({
                prev: channels[pos - 1],
                next: channels[pos + 1]
            });
        }, sort);
    };
    Channel.prototype.dealNeighbourInfo = function(neighbours) {
        this.doms.topLink.attr("href", pagePath.home).attr("title", "Home");
        var getChannelUrl = pagePath.channel;
        getChannelUrl = this.data.inSubscription ? pagePath.myChannel : getChannelUrl;
        getChannelUrl = this.data.inRecommend ? pagePath.recommendChannel : getChannelUrl;
        if (neighbours.prev) {
            this.doms.leftLink.attr("href", getChannelUrl(neighbours.prev.id)).attr("title", neighbours.prev.title).show();
        } else {
            this.doms.leftLink.hide();
        }
        if (neighbours.next) {
            this.doms.rightLink.attr("href", getChannelUrl(neighbours.next.id)).attr("title", neighbours.next.title).show();
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
        var getItemUrl = this.data.inSubscription ? pagePath.myItem : pagePath.recommendItem;
        items.map(function(item) {
            item.pageUrl = getItemUrl(item.id);
            return item;
        });
        this.data.items = items;
        this.renderItemList({
            items: items
        });
    };
    Channel.prototype.renderChannelInfo = function(data) {
        var _this = this;
        _this.doms.title.html(genChannelTitle(data));
        _this.doms.info.html(genChannelInfo(data));
        pageTitle.text(data.channel.title);
        _this.doms.vote = _this.doms.info.find("#vote");
        _this.doms.voteNum = _this.doms.info.find("#vote-num");
        _this.doms.vote.on("click", function(e) {
            e.preventDefault();
            var icon = $(this).find("i");
            icon.removeClass("icon-thumbs-up-alt").addClass("icon-spinner icon-spin");
            request.post({
                cid: _this.data.id
            }, apiPath.channel.vote, function(err) {
                icon.removeClass("icon-spinner icon-spin");
                if (err) {
                    icon.addClass("icon-frown");
                    setTimeout(function() {
                        icon.removeClass("icon-frown").addClass("icon-thumbs-up-alt");
                    }, 1e3);
                    return;
                }
                icon.addClass("icon-ok");
                _this.doms.voteNum.text("[" + ++_this.data.channel.score + "]");
                // refresh channel info
                resource.refresh("channel", {
                    id: _this.data.id
                });
                // refresh recommend list
                resource.makeList("channel", null, null, {
                    order: "score",
                    descrease: true
                }, null, true)(1);
                setTimeout(function() {
                    icon.removeClass("icon-ok").hide();
                }, 1e3);
            });
        });
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
        effect.bodyUnloading();
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

define("nireader/nireader-fe/2.1.0/module/floater-debug", [ "nireader/nireader-fe/2.1.0/kit/keypress-debug", "nireader/nireader-fe/2.1.0/kit/pattern-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/template/common/result-debug", "nireader/nireader-fe/2.1.0/template/common/tip-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug" ], function(require, exports, module) {
    var keypress = require("nireader/nireader-fe/2.1.0/kit/keypress-debug");
    var pattern = require("nireader/nireader-fe/2.1.0/kit/pattern-debug");
    var request = require("nireader/nireader-fe/2.1.0/kit/request-debug");
    var resource = require("nireader/nireader-fe/2.1.0/kit/resource-debug");
    var userinfo = require("nireader/nireader-fe/2.1.0/kit/userinfo-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug").notice;
    var URL = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var effect = require("nireader/nireader-fe/2.1.0/kit/effect-debug");
    var cache = require("nireader/nireader-fe/2.1.0/kit/cache-debug");
    var interfaces = require("nireader/nireader-fe/2.1.0/interface/index-debug");
    var apis = interfaces.api;
    var pages = interfaces.page;
    var genResult = require("nireader/nireader-fe/2.1.0/template/common/result-debug");
    var genTip = require("nireader/nireader-fe/2.1.0/template/common/tip-debug");
    var loadingIcon = require("nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug")();
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
    var visible;
    var showFloater = function() {
        if (visible) {
            return;
        }
        effect.bodyBlur();
        effect.headerBlur();
        globalFloater.addClass("show");
        initDom();
        initInfo();
        visible = true;
    };
    var hideFloater = function() {
        if (!visible) {
            return;
        }
        effect.bodyUnblur();
        effect.headerUnblur();
        globalFloater.removeClass("show");
        visible = false;
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
        showTip("好像是个rss地址，等我解析下... " + loadingIcon);
        createChannel(url, function(err, channel) {
            if (url !== currVal) {
                return;
            }
            cleanAll();
            if (err) {
                showTip("没解析出来，地址不对。");
                return;
            }
            var exist = !!channel.id;
            showTip("用<b>Enter</b>" + (exist ? "" : "添加并") + "订阅");
            addResult(channel.title, exist ? pages.channel(channel.id) : channel.link, exist);
            enterHandler = function() {
                saveChannel(channel, function(err, channel) {
                    if (err) {
                        showTip("没添加成功。");
                        return;
                    }
                    showTip(channel.title + "添加好了，正在订阅... " + loadingIcon);
                    addSubscription(channel.id, function(err, subscription) {
                        if (err) {
                            showTip("订阅" + channel.title + "没成功。（" + err + "）");
                            return;
                        }
                        cleanResult();
                        showTip("订阅了" + channel.title + "。");
                        reloadPage();
                    });
                });
            };
        });
    };
    var dealLogout = function() {
        showTip("按<b>Enter</b>登出。");
        enterHandler = function() {
            showTip("正在登出... " + loadingIcon);
            userinfo.logout(function(err) {
                if (err) {
                    notice("出错了。");
                    LOG(err);
                    return;
                }
                location.href = pages.home;
            });
        };
    };
    var dealHome = function() {
        showTip("按<b>Enter</b>去首页 ('/')。");
        enterHandler = function() {
            showTip("正在去首页... " + loadingIcon);
            customEvent.trigger("goto", "/");
            cleanTip();
        };
    };
    var dealCache = function() {
        showTip("按<b>Enter</b>查看缓存统计。");
        enterHandler = function() {
            showTip("正在计算... " + loadingIcon);
            var size = cache.getSize();
            setTimeout(function() {
                addResult([ "共", size.num, "条缓存记录" ].join(" "));
                addResult([ "占用存储空间", size.MB, "MB" ].join(" "));
                cleanTip();
            }, 300);
        };
    };
    var dealNoCache = function() {
        showTip("按<b>Enter</b>清除缓存。");
        enterHandler = function() {
            showTip("正在清除缓存... " + loadingIcon);
            var originSize = cache.getSize().MB + "MB";
            cache.clear();
            var currSize = cache.getSize().MB + "MB";
            setTimeout(function() {
                showTip("缓存已清空。（" + originSize + "->" + currSize + "）");
            }, 300);
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
        home: dealHome,
        cache: dealCache,
        nocache: dealNoCache
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
        var pos, cmd, matches = [];
        if (val) {
            for (var c in cmds) {
                if (cmds.hasOwnProperty(c) && (pos = c.indexOf(val)) >= 0) {
                    matches.push({
                        cmd: c,
                        pos: pos
                    });
                }
            }
            var maxNum = 3, last = (maxNum < matches.length ? maxNum : matches.length) - 1;
            matches.slice(0, maxNum).sort(function(a, b) {
                return a.pos < b.pos;
            }).forEach(function(match, i) {
                var c = match.cmd, p = match.pos, str = c.slice(0, p) + "<b>" + val + "</b>" + c.slice(p + val.length);
                if (i === last) {
                    str += "	 ---- 用<b>Tab</b>补全";
                    cmd = c;
                }
                addTip(str);
            });
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
    module.exports = {
        visible: function() {
            return visible;
        }
    };
});

define("nireader/nireader-fe/2.1.0/kit/keypress-debug", [], function(require, exports, module) {
    var eventList = {};
    var keyCode = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        enter: 13,
        backspace: 8
    };
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
    var unregister = function(which, handler, ctrl, alt) {
        var name = format(which, ctrl, alt), list, pos;
        if ((list = eventList[name]) && (pos = list.indexOf(handler)) >= 0) {
            list.splice(pos, 1);
        }
    };
    var trigger = function(which, ctrl, alt, e) {
        var name = format(which, ctrl, alt);
        if (eventList[name]) {
            var list = eventList[name];
            for (var i = 0, l = list.length; i < l; i++) {
                try {
                    list[i](e);
                } catch (e) {
                    LOG(e);
                    LOG(e.stack);
                }
            }
        }
    };
    $("body").on("keyup", function(e) {
        LOG("keypress", e.which, e.ctrlKey, e.altKey, e);
        trigger(e.which, e.ctrlKey, e.altKey, e);
        //e.preventDefault();
        return false;
    });
    var on = function(opt, handler) {
        if (opt = typeof opt === "number" ? {
            which: opt
        } : opt) {
            return register(opt.which, handler, opt.ctrl, opt.alt);
        }
    };
    var off = function(opt, handler) {
        if (opt = typeof opt === "number" ? {
            which: opt
        } : opt) {
            return unregister(opt.which, handler, opt.ctrl, opt.alt);
        }
    };
    module.exports = {
        register: register,
        unregister: unregister,
        on: on,
        off: off,
        trigger: trigger,
        code: keyCode
    };
});

define("nireader/nireader-fe/2.1.0/kit/pattern-debug", [], function(require, exports, module) {
    var urlPattern = /[a-z]+\:\/\/[\w]+\.[\w]+/;
    module.exports = {
        url: urlPattern
    };
});

define("nireader/nireader-fe/2.1.0/template/common/result-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<li class="result">' + '<a href="<%=result.link%>" target="<%=result.target%>" ' + '<%=result.async?"data-link-async=true":""%>>' + "<%==result.word%>" + "</a>" + "</li>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/common/tip-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<li class="tip">' + "<%==tip.word%>" + "</li>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/channel/title-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<%=channel.title%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/channel/info-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<% if(channel.description){ %>" + '<span class="mr20 ml150" title="<%=channel.description%>">' + "<%=channel.description%>" + "</span>" + "<% } %>" + '<span class="mr20">' + "更新于<%=formatTime(channel.pubDate)%>" + "</span>" + '<a class="mr20" href="<%=channel.link%>" target="_blank" title="站点">' + "站点" + "</a>" + '<span id="vote-num" class="mr10" title="被推荐<%=channel.score%>次">[<%=channel.score%>]</span>' + '<span id="vote" class="vote" title="推荐">' + '<i class="icon-thumbs-up-alt"></i>' + "</span>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/channel/itemList-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<ul class="item-list">' + "<%for(i = 0; i < items.length; i ++) {%>" + '<li class="item" data-id="<%=items[i].id%>">' + '<a data-link-async="true" href="<%=items[i].pageUrl%>">' + "<%=items[i].title%>" + "</a>" + '<span class="pubdate">' + '<%=formatTime(items[i].pubDate, " ")%>' + "</span>" + "</li>" + "<%}%>" + "</ul>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/content/item-debug", [ "nireader/nireader-fe/2.1.0/module/floater-debug", "nireader/nireader-fe/2.1.0/kit/keypress-debug", "nireader/nireader-fe/2.1.0/kit/pattern-debug", "nireader/nireader-fe/2.1.0/kit/request-debug", "nireader/nireader-fe/2.1.0/kit/resource-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/url-debug", "nireader/nireader-fe/2.1.0/interface/index-debug", "nireader/nireader-fe/2.1.0/kit/userinfo-debug", "nireader/nireader-fe/2.1.0/kit/cookie-debug", "nireader/nireader-fe/2.1.0/kit/notice-debug", "nireader/nireader-fe/2.1.0/template/common/notice-debug", "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug", "nireader/nireader-fe/2.1.0/kit/customEvent-debug", "nireader/nireader-fe/2.1.0/kit/effect-debug", "nireader/nireader-fe/2.1.0/template/common/loader-debug", "nireader/nireader-fe/2.1.0/template/common/result-debug", "nireader/nireader-fe/2.1.0/template/common/tip-debug", "nireader/nireader-fe/2.1.0/template/common/loadingIcon-debug", "nireader/nireader-fe/2.1.0/kit/eventList-debug", "nireader/nireader-fe/2.1.0/template/item/title-debug", "nireader/nireader-fe/2.1.0/template/item/info-debug", "nireader/nireader-fe/2.1.0/template/item/content-debug", "nireader/nireader-fe/2.1.0/template/item/channelTitle-debug", "nireader/nireader-fe/2.1.0/kit/testScroll-debug" ], function(require, exports, module) {
    var floater = require("nireader/nireader-fe/2.1.0/module/floater-debug");
    var resource = require("nireader/nireader-fe/2.1.0/kit/resource-debug");
    var pagePath = require("nireader/nireader-fe/2.1.0/interface/index-debug").page;
    var URL = require("nireader/nireader-fe/2.1.0/kit/url-debug");
    var eventList = require("nireader/nireader-fe/2.1.0/kit/eventList-debug");
    var notice = require("nireader/nireader-fe/2.1.0/kit/notice-debug");
    var customEvent = require("nireader/nireader-fe/2.1.0/kit/customEvent-debug");
    var effect = require("nireader/nireader-fe/2.1.0/kit/effect-debug");
    var keypress = require("nireader/nireader-fe/2.1.0/kit/keypress-debug");
    var genItemTitle = require("nireader/nireader-fe/2.1.0/template/item/title-debug");
    var genItemInfo = require("nireader/nireader-fe/2.1.0/template/item/info-debug");
    var genItemContent = require("nireader/nireader-fe/2.1.0/template/item/content-debug");
    var genItemChannelTitle = require("nireader/nireader-fe/2.1.0/template/item/channelTitle-debug");
    var pageTitle = $("title");
    var inSubscriptionFlag = "/my/";
    var inRecommendFlag = "/recommend/";
    var testScroll = require("nireader/nireader-fe/2.1.0/kit/testScroll-debug");
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
        var upButton = this.doms.upButton;
        var checkoutDelay = 300;
        var addEvent = this.eventList.add.bind(this.eventList), removeEvent = this.eventList.remove.bind(this.eventList);
        this.doms.content.find("a").each(function(i, a) {
            a = $(a);
            if (!a.attr("data-link-async")) {
                a.attr("target", "_blank");
            }
        });
        addEvent(upButton, "click", function(e) {
            e.preventDefault();
            upButton.animate({
                marginTop: "8px"
            }, 100, function() {
                middleBlock.animate({
                    scrollTop: 0
                }, 100, function() {
                    upButton.css({
                        marginTop: 0
                    });
                });
            });
        });
        var _this = this;
        addEvent(middleBlock, "scroll", function(e) {
            removeEvent(middleBlock, "mousewheel", topScroll);
            removeEvent(middleBlock, "mousewheel", bottomScroll);
            var mb = middleBlock[0];
            var offsetTop = 40, offsetBottom = 60;
            var readPercent = mb.scrollTop / (mb.scrollHeight - mb.clientHeight);
            var top = readPercent * (mb.clientHeight - offsetTop - offsetBottom - upButton.height()) + offsetTop + "px";
            var opacity = readPercent;
            upButton.text(Math.floor(readPercent * 100) + "%").css({
                top: top,
                opacity: opacity
            });
        });
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
        setTimeout(function() {
            addEvent(middleBlock, "mousewheel", function(e, delta, deltaX, deltaY) {
                //removeEvent(middleBlock, 'mousewheel', topScroll);
                //removeEvent(middleBlock, 'mousewheel', bottomScroll);
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
        }, 200);
        addEvent(keypress, keypress.code.left, function(e) {
            !floater.visible() && leftLink.click();
        });
        addEvent(keypress, keypress.code.right, function(e) {
            !floater.visible() && rightLink.click();
        });
    };
    Item.prototype.clean = function() {
        this.eventList.clean();
        /*this.doms.content.html('');
        this.doms.title.html('');
        this.doms.info.html('');*/
        this.doms.upButton.remove();
        clearTimeout(this.data.timer);
        clearTimeout(this.data.timer1);
        clearTimeout(this.data.timer2);
        this.doms.leftLink.attr("href", "");
        this.doms.rightLink.attr("href", "");
        this.doms.topLink.attr("href", "");
        effect.bodyLoading();
    };
    Item.prototype.prepareInfo = function() {
        var _this = this;
        _this.data = {
            id: parseInt(URL.parse(_this.url).id, 10),
            inSubscription: _this.url.indexOf(inSubscriptionFlag) === 0,
            inRecommend: _this.url.indexOf(inRecommendFlag) === 0
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
        var upButton = document.createElement("div");
        upButton.className = "up-button";
        _this.doms.wrapper.append(upButton);
        _this.doms.upButton = $(upButton);
    };
    Item.prototype.getItemInfo = function(callback) {
        var _this = this;
        resource.get("item", {
            id: _this.data.id
        }, function(err, item) {
            if (err) {
                if (err.status == 404) {
                    notice.NotFound();
                } else {
                    LOG(err);
                }
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
        var genUrl = pagePath.channel;
        genUrl = this.data.inSubscription ? pagePath.myChannel : genUrl;
        genUrl = this.data.inRecommend ? pagePath.recommendChannel : genUrl;
        channel.pageUrl = genUrl(channel.id);
        this.data.channel = channel;
        this.renderChannelInfo({
            channel: channel
        });
    };
    Item.prototype.getNeighbourInfo = function(callback) {
        var _this = this;
        resource.list("item", {
            source: _this.data.item.source
        }, null, function(err, items) {
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
            if (pos === -1) {
                notice.NotFound();
                return;
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
        var getItemUrl = pagePath.item;
        getItemUrl = this.data.inSubscription ? pagePath.myItem : getItemUrl;
        getItemUrl = this.data.inRecommend ? pagePath.recommendItem : getItemUrl;
        if (neighbours.prev) {
            this.doms.leftLink.attr("href", getItemUrl(neighbours.prev.id)).attr("title", neighbours.prev.title).show();
        } else {
            this.doms.leftLink.hide();
        }
        if (neighbours.next) {
            this.doms.rightLink.attr("href", getItemUrl(neighbours.next.id)).attr("title", neighbours.next.title).show();
        } else {
            this.doms.rightLink.hide();
        }
    };
    Item.prototype.renderItemInfo = function(data) {
        pageTitle.text(data.item.title);
        this.doms.title.html(genItemTitle(data));
        this.doms.info.html(genItemInfo(data));
        this.doms.content.html(genItemContent(data));
        effect.bodyUnloading();
    };
    Item.prototype.renderChannelInfo = function(data) {
        this.doms.topLink.attr("href", data.channel.pageUrl);
        this.doms.topLink.attr("title", data.channel.title);
        this.doms.info.prepend(genItemChannelTitle(data));
    };
    module.exports = Item;
});

define("nireader/nireader-fe/2.1.0/template/item/title-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<%=item.title%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/item/info-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<span class="mr40">' + "于<%=formatTime(item.pubDate)%>" + "</span>" + '<a class="mr40" href="<%=item.link%>" target="_blank" title="原文">' + "原文" + "</a>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/item/content-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = "<%==item.content%>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/template/item/channelTitle-debug", [ "nireader/nireader-fe/2.1.0/template/template-debug", "nireader/nireader-fe/2.1.0/kit/time-debug", "nireader/nireader-fe/2.1.0/kit/num-debug" ], function(require, exports, module) {
    var template = require("nireader/nireader-fe/2.1.0/template/template-debug");
    var tmpl = '<span class="">' + "来自" + '<a href="<%=channel.pageUrl%>" title="<%=channel.description%>" data-link-async=true >' + "<%=channel.title%> " + "</a>" + "</span>";
    module.exports = template.compile(tmpl);
});

define("nireader/nireader-fe/2.1.0/kit/testScroll-debug", [], function(require, exports, module) {
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

define("nireader/nireader-fe/2.1.0/module/task-debug", [], function(require, exports, module) {
    function Task(name, exec, duration) {
        var self = this;
        self.name = name;
        self.duration = duration;
        self.repeat = typeof self.duration === "number";
        self.exec = function() {
            try {
                exec.call(self, self);
            } catch (e) {
                LOG(e);
            }
        };
    }
    Task.prototype.run = function() {
        if (!this.timer) {
            this.exec();
            if (this.repeat) {
                this.timer = setInterval(this.exec, this.duration);
            }
        }
        return this;
    };
    Task.prototype.stop = function() {
        this.timer = this.timer && clearInterval(this.timer);
        return this;
    };
    Task.list = [];
    Task.add = function(name, exec, duration) {
        var task;
        if (name.constructor && name.constructor === Task) {
            task = name;
        } else {
            task = new Task(name, exec, duration);
        }
        this.list.push(task);
        return this;
    };
    Task.runFrom = function(i, duration) {
        i = typeof i === "number" ? i : 0;
        duration = typeof duration === "number" ? duration : 0;
        if (i >= this.list.length) {
            return this;
        }
        try {
            this.list[i].run();
        } catch (e) {
            LOG(e);
        }
        var self = this;
        setTimeout(function() {
            self.runFrom(++i, duration);
        }, duration);
        return this;
    };
    Task.run = Task.runFrom;
    Task.stop = function() {
        for (var i = 0, l = this.list.length; i < l; i++) {
            this.list[i].stop();
        }
        return this;
    };
    module.exports = Task;
});

define("nireader/nireader-fe/2.1.0/module/tasks/logger-debug", [ "nireader/nireader-fe/2.1.0/module/task-debug", "nireader/nireader-fe/2.1.0/kit/local-debug" ], function(require, exports, module) {
    var Task = require("nireader/nireader-fe/2.1.0/module/task-debug");
    var local = require("nireader/nireader-fe/2.1.0/kit/local-debug").create("logger");
    module.exports = new Task("logger", function(task) {
        local.set("time", Date.now());
        LOG("log", local.getAll());
    }, 1e3 * 60);
});

define("nireader/nireader-fe/2.1.0/module/tasks/cacheManager-debug", [ "nireader/nireader-fe/2.1.0/module/task-debug", "nireader/nireader-fe/2.1.0/config-debug", "nireader/nireader-fe/2.1.0/kit/cache-debug", "nireader/nireader-fe/2.1.0/kit/local-debug" ], function(require, exports, module) {
    var Task = require("nireader/nireader-fe/2.1.0/module/task-debug");
    var autoManageInterval = require("nireader/nireader-fe/2.1.0/config-debug").cache.manageInterval;
    var cache = require("nireader/nireader-fe/2.1.0/kit/cache-debug");
    module.exports = new Task("cacheManager", cache.manage.bind(cache), autoManageInterval);
});

define("nireader/nireader-fe/2.1.0/module/tasks/breath-debug", [ "nireader/nireader-fe/2.1.0/module/task-debug" ], function(require, exports, module) {
    var Task = require("nireader/nireader-fe/2.1.0/module/task-debug");
    module.exports = new Task("breath", function(task) {
        $("#body").addClass("breath");
    });
});
