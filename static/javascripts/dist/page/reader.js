define("nireader/nireader-fe/1.0.0/page/reader",["../module/stateManager","../kit/url","../kit/customEvent","../module/page","../module/createContent","../content/home","../kit/resource","../kit/request","../kit/cache","../interface/index","../kit/notice","../kit/eventList","../template/home/title","../template/template","../kit/time","../kit/num","../template/home/info","../template/home/subscriptionList","../template/home/recommendList","../template/home/channelInfo","../content/entrance","../content/channel","../template/channel/title","../template/channel/info","../template/channel/itemList","../content/item","../template/item/title","../template/item/info","../template/item/content","../template/item/channelTitle","../module/floater","../kit/keypress","../kit/pattern","../template/common/result","../template/common/tip","../template/common/loadingIcon"],function(a,b,c){var d=a("../module/stateManager"),e=a("../module/page");a("../module/floater");var f=a("../kit/customEvent"),g=function(){d.on("checkout",function(a){e.checkout(a)}),f.on("userInfoUpdate",function(){e.content&&"home"===e.content.type&&d.checkout()})};c.exports={name:"reader",bind:g}}),define("nireader/nireader-fe/1.0.0/module/stateManager",["nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/kit/customEvent"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/url").format,e=a("nireader/nireader-fe/1.0.0/kit/customEvent"),f=function(){this.handlers={},this.init()};f.prototype.init=function(){this.bindEvent()},f.prototype.bindEvent=function(){var a=this,b=function(b){b=d(b),a.pushState({url:b,title:"Loading"}),a.checkout()};$("body").delegate("[data-link-async]","click",function(a){a.preventDefault();var c=$(this);return c.attr("disabled")?!1:(b(c.attr("href")),void 0)}),e.on("goto",b),window.onpopstate=function(){a.checkout()}},f.prototype.pushState=function(a){history.pushState(a,a.title,a.url)},f.prototype.checkout=function(){this.trigger("checkout")},f.prototype.on=function(a,b){this.handlers[a]=this.handlers[a]||[],this.handlers[a].push(b)},f.prototype.trigger=function(a){var b=this.handlers[a],c=Array.prototype.slice.call(arguments,1);if(b)for(var d=0,e=b.length;e>d;d++)try{b[d].apply(this,c)}catch(f){console.warn(f),console.log(f.stack)}},c.exports=new f}),define("nireader/nireader-fe/1.0.0/kit/url",[],function(a,b){var c=function(a){var b=a.indexOf("://");return 0>b?a:(a=a.slice(b+3),b=a.indexOf("/"),0>b?"/":a.slice(b))},d=function(a){return a.indexOf("/")?location.pathname.replace(/([\w\d\_]*)$/,a):a},e=function(a){return a?(a=c(a),a=d(a)):null},f=function(a){var b=/\/([\w]*)(\/([\w]+))?($|\?)/,c={};if(b.test(a)){var d=b.exec(a);c.type=d[1],d[3]&&(c.id=parseInt(d[3],10))}return c},g=function(a){return a.indexOf("://")<0?!0:0===a.indexOf(location.origin)?!0:!1};b.format=e,b.parse=f,b.isSameDomain=g}),define("nireader/nireader-fe/1.0.0/kit/customEvent",[],function(a,b,c){var d={};c.exports={on:function(a,b){d[a]=d[a]||[],d[a].push(b)},off:function(a,b){var c,e;(c=d[a])&&(e=c.indexOf(b))>=0&&c.splice(e,1)},trigger:function(a){var b;if(b=d[a])for(var c=0,e=b.length;e>c;c++)try{b[c].apply(null,Array.prototype.slice.call(arguments,1))}catch(f){console.log(f.stack)}}}}),define("nireader/nireader-fe/1.0.0/module/page",["nireader/nireader-fe/1.0.0/module/createContent","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/content/home","nireader/nireader-fe/1.0.0/kit/resource","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/kit/notice","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/template/home/title","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/home/info","nireader/nireader-fe/1.0.0/template/home/subscriptionList","nireader/nireader-fe/1.0.0/template/home/recommendList","nireader/nireader-fe/1.0.0/template/home/channelInfo","nireader/nireader-fe/1.0.0/content/entrance","nireader/nireader-fe/1.0.0/kit/customEvent","nireader/nireader-fe/1.0.0/content/channel","nireader/nireader-fe/1.0.0/template/channel/title","nireader/nireader-fe/1.0.0/template/channel/info","nireader/nireader-fe/1.0.0/template/channel/itemList","nireader/nireader-fe/1.0.0/content/item","nireader/nireader-fe/1.0.0/template/item/title","nireader/nireader-fe/1.0.0/template/item/info","nireader/nireader-fe/1.0.0/template/item/content","nireader/nireader-fe/1.0.0/template/item/channelTitle"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/module/createContent"),e=a("nireader/nireader-fe/1.0.0/kit/url"),f={wrapper:$("#body"),middleBlock:$("#middle-block")};f.getUrl=function(){this.url=e.format(location.href)},f.initContent=function(){this.content=d({url:this.url,wrapper:this.wrapper}),this.content.init()},f.init=function(){this.getUrl(),this.initContent(),this.middleBlock.animate({scrollTop:0},300)},f.clean=function(){this.content&&this.content.clean(),this.content=null},f.checkout=function(){this.clean(),this.init()},c.exports=f}),define("nireader/nireader-fe/1.0.0/module/createContent",["nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/content/home","nireader/nireader-fe/1.0.0/kit/resource","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/kit/notice","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/template/home/title","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/home/info","nireader/nireader-fe/1.0.0/template/home/subscriptionList","nireader/nireader-fe/1.0.0/template/home/recommendList","nireader/nireader-fe/1.0.0/template/home/channelInfo","nireader/nireader-fe/1.0.0/content/entrance","nireader/nireader-fe/1.0.0/kit/customEvent","nireader/nireader-fe/1.0.0/content/channel","nireader/nireader-fe/1.0.0/template/channel/title","nireader/nireader-fe/1.0.0/template/channel/info","nireader/nireader-fe/1.0.0/template/channel/itemList","nireader/nireader-fe/1.0.0/content/item","nireader/nireader-fe/1.0.0/template/item/title","nireader/nireader-fe/1.0.0/template/item/info","nireader/nireader-fe/1.0.0/template/item/content","nireader/nireader-fe/1.0.0/template/item/channelTitle"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/url"),e={home:a("nireader/nireader-fe/1.0.0/content/home"),welcome:a("nireader/nireader-fe/1.0.0/content/entrance"),channel:a("nireader/nireader-fe/1.0.0/content/channel"),item:a("nireader/nireader-fe/1.0.0/content/item")},f=function(a){var b=a.type||d.parse(a.url).type||"home",c=e[b];return c?new c(a):null};c.exports=f}),define("nireader/nireader-fe/1.0.0/content/home",["nireader/nireader-fe/1.0.0/kit/resource","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/kit/notice","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/template/home/title","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/home/info","nireader/nireader-fe/1.0.0/template/home/subscriptionList","nireader/nireader-fe/1.0.0/template/home/recommendList","nireader/nireader-fe/1.0.0/template/home/channelInfo"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/resource"),e=a("nireader/nireader-fe/1.0.0/kit/request"),f=a("nireader/nireader-fe/1.0.0/kit/notice"),g=a("nireader/nireader-fe/1.0.0/kit/eventList").create("content/home"),h=g.add,i=a("nireader/nireader-fe/1.0.0/interface/index").api,j=a("nireader/nireader-fe/1.0.0/template/home/title"),k=a("nireader/nireader-fe/1.0.0/template/home/info"),l=a("nireader/nireader-fe/1.0.0/template/home/subscriptionList"),m=a("nireader/nireader-fe/1.0.0/template/home/recommendList"),n=a("nireader/nireader-fe/1.0.0/template/home/channelInfo"),o=function(a){this.url=a.url,this.wrapper=a.wrapper,this.type="home"};o.prototype.init=function(){this.prepareInfo(),this.initDoms(),this.getSubscriptionListByPage(1),this.getRecommendList(),this.getUserInfo(),this.dealLinks(),this.bindEvent()},o.prototype.bindEvent=function(){},o.prototype.clean=function(){g.clean(),this.doms.sideContent.html(""),this.doms.sideBlock.clearQueue().stop().hide(),this.doms.leftLink.attr("href","").show(),this.doms.rightLink.attr("href","").show(),this.doms.topLink.attr("href","").show()},o.prototype.prepareInfo=function(){var a=this;a.data={},a.doms={wrapper:a.wrapper,middleBlock:a.wrapper.find("#middle-block"),title:a.wrapper.find("#title"),info:a.wrapper.find("#info"),content:a.wrapper.find("#content"),sideBlock:a.wrapper.find("#side-block"),sideContent:a.wrapper.find("#side-content"),leftLink:a.wrapper.find("#left-link"),rightLink:a.wrapper.find("#right-link"),topLink:a.wrapper.find("#top-link")},a.sideBlock=a.genSideBlock()},o.prototype.initDoms=function(){},o.prototype.genSideBlock=function(){var a,b=this,c=b.doms.middleBlock,g=b.doms.sideBlock,j=b.doms.sideContent,k=function(){g.addClass("loading")},l=function(a){g.removeClass("loading"),j.html(a)},m=function(a){var b=a.offset().top+c.scrollTop(),d=parseInt(g.css("top"),10);g.stop().clearQueue().show().delay(200).animate({top:(6*b-d)/5},100).animate({top:b},50)},o=function(){a=setTimeout(function(){g.hide()},200)},p=function(){a&&(a=clearTimeout(a))},q=function(a,c){c.addClass("icon-spinner icon-spin"),e.post({subscribee:a},i.subscription.add,function(e){c.removeClass("icon-spinner icon-spin"),e?(f("订阅失败"),console.warn(e)):(c.removeClass("icon-eye-close").addClass("icon-eye-open"),d.refresh("channel",{id:a}),b.refreshSubscriptionList())})},r=function(a,c){c.addClass("icon-spinner icon-spin"),e.post({subscribee:a},i.subscription.remove,function(e){c.removeClass("icon-spinner icon-spin"),e?(f("取消订阅失败"),console.warn(e)):(c.removeClass("icon-eye-open").addClass("icon-eye-close"),d.refresh("channel",{id:a}),b.refreshSubscriptionList())})},s=function(a){var b=g.find("#channel-subscribed");h(b,"click",function(){(b.hasClass("icon-eye-open")?r:q)(a,b)})},t=function(){p();var a=$(this),b=a.attr("data-id");g.attr("data-cid",b),m(a),k(),d.get("channel",{id:b},function(a,c){if(g.attr("data-cid")==b){if(a)return l("Get channel info failed."),void 0;l(n({channel:c})),s(b)}})},u=function(a){h(a.find(".item"),"mouseenter",t),h(a,"mouseleave",o)};return h(g,"mouseenter",p),h(g,"mouseleave",o),{bind:u}},o.prototype.getUserInfo=function(){var a=this;d.get("user",{},function(b,c){return b?(console.error(b||"Can not get user info."),void 0):(a.dealUserInfo(c),void 0)})},o.prototype.dealUserInfo=function(a){this.data.user=a,this.renderHomeInfo({user:a})},o.prototype.dealLinks=function(){this.doms.topLink.hide(),this.doms.leftLink.hide(),this.doms.rightLink.hide()},o.prototype.getSubscriptionListByPage=function(a){var b=this;d.makeList("subscription",{},function(c,d){return c?(console.error(c),void 0):(b.data.subscriptionListPage=a,b.dealSubscriptionList(d),void 0)})(a)},o.prototype.refreshSubscriptionList=function(){this.doms.subscriptionList&&this.doms.subscriptionList.remove(),this.getSubscriptionListByPage(this.data.subscriptionListPage)},o.prototype.dealSubscriptionList=function(a){this.data.subscriptions=a,this.renderSubscriptionList({subscriptions:a})},o.prototype.getRecommendList=function(){var a=this;d.makeList("channel",{},function(b,c){return b?(console.error(b),void 0):(a.dealRecommendList(c),void 0)})(1)},o.prototype.dealRecommendList=function(a){this.data.recommends=a,this.renderRecommendList({recommends:a})},o.prototype.renderHomeInfo=function(a){this.doms.title.html(j(a)),this.doms.info.html(k(a))},o.prototype.renderSubscriptionList=function(a){this.recommendListReady?this.doms.content.prepend(l(a)):this.doms.content.html(l(a)),this.subscriptionListReady=!0,this.doms.subscriptionList=this.doms.content.find("#subscription-list"),this.sideBlock.bind(this.doms.subscriptionList)},o.prototype.renderRecommendList=function(a){this.subscriptionListReady?this.doms.content.append(m(a)):this.doms.content.html(m(a)),this.recommendListReady=!0,this.doms.recommendList=this.doms.content.find("#recommend-list"),this.sideBlock.bind(this.doms.recommendList)},c.exports=o}),define("nireader/nireader-fe/1.0.0/kit/resource",["nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/interface/index"],function(a,b){var c=a("nireader/nireader-fe/1.0.0/kit/request"),d=a("nireader/nireader-fe/1.0.0/kit/cache");a("nireader/nireader-fe/1.0.0/kit/url").format;var e=a("nireader/nireader-fe/1.0.0/interface/index").api,f={item:e.item.get,channel:e.channel.get,user:e.user.get},g={item:{order:"pubDate",descrease:!0},channel:{order:"id",descrease:!1},user:{order:"name",descrease:!1}},h=function(a,b,e,h){if(a&&"string"==typeof a){var i={type:a,opt:b,sort:h},j={opt:b,sort:h||g[a]},k=f[a];c.get(j,k,function(a,b){a||d.set(i,b),e&&e(a,b)})}},i=function(a,b,e,h,i){if(a&&"string"==typeof a){var j,k={type:a,opt:b,sort:h};if(!i&&(j=d.get(k)))return e&&e(null,j),void 0;var l={opt:b,sort:h||g[a]},m=f[a];c.get(l,m,function(a,b){a||d.set(k,b),e&&e(a,b)})}},j={item:e.item.list,channel:e.channel.list,subscription:e.subscription.list},k={item:["id","pubDate","title","source"],channel:["id","pubDate","title"],subscription:["channel.id","channel.pubDate","channel.title","channel.description","channel.generator"]},l={item:{order:"pubDate",descrease:!0},channel:{order:"id",descrease:!1},subscription:{order:"channel.id",descrease:!1}},m={item:20,channel:20,subscription:20},n=function(a,b,d,e,f,g){if(a&&"string"==typeof a){var h,i=m[a];"object"==typeof d&&(h=d);var n={opt:b,fields:g||k[a],sort:f||l[a],limit:h||(i?{from:i*(d-1),num:i}:null)},o=j[a];c.get(n,o,e)}},o=function(a,b,c,d,e){return function(f){return n(a,b,f,c,d,e)}};b.refresh=h,b.get=i,b.list=n,b.makeList=o}),define("nireader/nireader-fe/1.0.0/kit/request",[],function(a,b){var c=3,d=function(a,b,e,f,g){"string"==typeof b&&(g=f,f=e,e=b,b=null),$.ajax(e,{data:b,type:a,dataType:"json",headers:{isAjax:!0},success:function(a){f&&f(a.err,a.data)},error:function(h){g===!0&&(g=c),"number"==typeof g&&g>0?d(a,b,e,f,--g):f&&f(h,null)}})};b.post=function(a,b,c,e){d("post",a,b,c,e)},b.get=function(a,b,c,e){d("get",a,b,c,e)}}),define("nireader/nireader-fe/1.0.0/kit/cache",[],function(a,b,c){var d=3e5,e=50,f=[],g=[],h=function(a){var b=g.indexOf(a),c=g.length-1;b>=0&&b!=c&&g.splice(b,1),g.push(a)},i=function(a,b){a=JSON.stringify(a),b=JSON.stringify(b),h(a),f[a]=b},j=function(a){a=JSON.stringify(a),h(a);var b=f[a];return b?JSON.parse(b):void 0},k=function(){for(var a,b=g.length-e,c=0;b>c;c++)a=g[c],delete f[a];g=g.slice(b,g.length)},l=function(){setInterval(k,d)};l(),c.exports={set:i,get:j}}),define("nireader/nireader-fe/1.0.0/interface/index",[],function(a,b,c){var d={channel:{get:"/api/channel",list:"/api/list/channel",create:"/api/channel/create",save:"/api/channel/save"},item:{get:"/api/item",list:"/api/list/item"},subscription:{get:"/api/subscription",list:"/api/list/subscription",add:"/api/subscription/add",remove:"/api/subscription/remove"},user:{get:"/api/user"},auth:{"in":"/api/signin",out:"/api/signout"}},e={home:"/",channel:function(a){return"/channel/"+a},item:function(a){return"/item/"+a}};c.exports={api:d,page:e}}),define("nireader/nireader-fe/1.0.0/kit/notice",[],function(a,b,c){c.exports=function(a){"string"!=typeof a&&(a=JSON.stringfy(a)),alert(a)}}),define("nireader/nireader-fe/1.0.0/kit/eventList",[],function(a,b,c){var d={},e=function(a){var b=d[a]=[];return{name:a,list:b,add:function(a,c,d){try{a.on(c,d),b.push({dom:a,event:c,handler:d})}catch(e){console.log(e.stack)}return b},clean:function(){try{for(var c,e=b.length-1;e>=0;e--){var c=b[e];c.dom.off(c.event,c.handler)}}catch(f){console.log(f.stack)}b=d[a]=[]}}};c.exports={create:e}}),define("nireader/nireader-fe/1.0.0/template/home/title",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e="<%=user.name%>";c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/template",["nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/time").format;template.helper("formatTime",d),c.exports=template}),define("nireader/nireader-fe/1.0.0/kit/time",["nireader/nireader-fe/1.0.0/kit/num"],function(a,b){var c=a("nireader/nireader-fe/1.0.0/kit/num").toLength,d=function(){var a=new Date;return a.setMilliseconds(0),a.setSeconds(0),a.setMinutes(0),a.setHours(0),a},e=(new Date).getFullYear(),f=d();setInterval(function(){e=(new Date).getFullYear(),f=d()},6e4);var g=function(a,b){var c=new Date(a.valueOf());return c.setDate(c.getDate()-b),c},h=["今天","昨天","天前"],i=["零","一","两","三","四","五"],j=function(a){if(a>f)return h[0];if(a>g(f,1))return h[1];for(var b=2;5>=b;b++)if(a>g(f,b))return i[b]+h[2];var d="",j=a.getFullYear(),k=c(a.getMonth()+1,2),l=c(a.getDate(),2);return j!==e&&(d+=j+"年"),d+=k+"月"+l+"日"},k=function(a){return c(a.getHours(),2)+":"+c(a.getMinutes(),2)},l=function(a,b){var c=new Date(a);return b=void 0===b?"":b,j(c)+b+k(c)};b.formatDate=j,b.formatDay=k,b.format=l}),define("nireader/nireader-fe/1.0.0/kit/num",[],function(a,b){var c=function(a,b){var c=(a+"").slice(0,b);if(c.length<b)for(var d=c.length;b>d;d++)c="0"+c;return c},d=function(a,b){("number"!=typeof b||1>b)&&(b=1);var c=a.toFixed(b),d=/[0]+$/,e=/\.$/;return c.replace(d,"").replace(e,"")},e=function(a,b){a=a||0,b=b||100;var c=Math.random()*(b-a);return Math.floor(c+a)};b.toLength=c,b.format=d,b.random=e}),define("nireader/nireader-fe/1.0.0/template/home/info",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<% if(user.description){ %><span class="mr20 ml150" title="<%=user.description%>"><%=user.description%></span><% } %><% if(user.homepage){ %><a class="mr20" href="<%=user.homepage%>" target="_blank" title="页面">SITE</a><% } %>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/home/subscriptionList",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<ul id="subscription-list" class="item-list"><%for(i = 0; i < subscriptions.length; i ++) {%><li class="item" data-id="<%=subscriptions[i].id%>"><a data-link-async="true" data-link-preload="true" href="/channel/<%=subscriptions[i].id%>"><%=subscriptions[i].title%></a><span class="pubdate"><%="更新于" + formatTime(subscriptions[i].pubDate, " ")%></span></li><%}%></ul>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/home/recommendList",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<h6 class="sub-title">Recommend:</h6><ul id="recommend-list" class="item-list"><%for(i = 0; i < recommends.length; i ++) {%><li class="item" data-id="<%=recommends[i].id%>"><a data-link-async="true" data-link-preload="true" href="/channel/<%=recommends[i].id%>"><%=recommends[i].title%></a><span class="pubdate"><%="更新于" + formatTime(recommends[i].pubDate, " ")%></span></li><%}%></ul>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/home/channelInfo",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<h3 class="channel-title"><%=channel.title%><i id="channel-subscribed" class="icon-eye-<%=channel.subscribed?"open":"close"%>" title="<%=channel.subscribed?"已订阅":"未订阅"%>"></i></h3><p class="channel-description"><%=channel.description%></p><p class="channel-generator"><%=channel.generator%></p>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/content/entrance",["nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/customEvent","nireader/nireader-fe/1.0.0/kit/notice","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/interface/index"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/request"),e=a("nireader/nireader-fe/1.0.0/kit/customEvent"),f=a("nireader/nireader-fe/1.0.0/kit/notice"),g=a("nireader/nireader-fe/1.0.0/kit/eventList").create("content/entrance"),h=g.add,i=a("nireader/nireader-fe/1.0.0/interface/index").api,j=function(a){this.url=a.url,this.type="entrance"};j.prototype.init=function(){this.prepareInfo(),this.dealLinks(),this.bindEvent()},j.prototype.dealLinks=function(){this.doms.topLink.hide(),this.doms.leftLink.hide(),this.doms.rightLink.hide()},j.prototype.bindEvent=function(){var a=this,b=this.doms;h(b.signin,"click",function(){return b.signinBlock.fadeIn(),!1}),h(b.submit,"click",function(){a.signIn()}),h(b.passwordIN,"keyup",function(b){13===b.which&&a.signIn()})},j.prototype.signIn=function(){var a=this.doms.nameIn.val(),b=this.doms.passwordIN.val();a&&b&&d.post({username:a,password:b},i.auth.in,function(a){return a?(f(a),void 0):(e.trigger("goto","/"),void 0)})},j.prototype.clean=function(){g.clean(),this.doms.wrapper.animate({marginTop:"-100%"},1e3)},j.prototype.prepareInfo=function(){this.doms={wrapper:$("#header"),leftLink:$("#left-link"),rightLink:$("#right-link"),topLink:$("#top-link"),signin:$("#signin"),signinBlock:$("#signin-block"),nameIn:$("#name-in"),passwordIN:$("#password-in"),submit:$("#submit")}},c.exports=j}),define("nireader/nireader-fe/1.0.0/content/channel",["nireader/nireader-fe/1.0.0/kit/resource","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/template/channel/title","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/channel/info","nireader/nireader-fe/1.0.0/template/channel/itemList"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/resource"),e=a("nireader/nireader-fe/1.0.0/interface/index").page,f=a("nireader/nireader-fe/1.0.0/kit/url"),g=a("nireader/nireader-fe/1.0.0/kit/eventList").create("content/channel"),h=g.add,i=a("nireader/nireader-fe/1.0.0/template/channel/title"),j=a("nireader/nireader-fe/1.0.0/template/channel/info"),k=a("nireader/nireader-fe/1.0.0/template/channel/itemList"),l=function(a){this.url=a.url,this.wrapper=a.wrapper,this.type="channel"};l.prototype.init=function(){this.prepareInfo(),this.getItemListByPage(1),this.getChannelInfo(),this.getNeighbourInfo(),this.bindEvent()},l.prototype.bindEvent=function(){},l.prototype.clean=function(){g.clean(),this.doms.sideContent.html(""),this.doms.sideBlock.clearQueue().stop().hide(),this.doms.leftLink.attr("href",""),this.doms.rightLink.attr("href",""),this.doms.topLink.attr("href","")},l.prototype.prepareInfo=function(){var a=this;a.data={id:parseInt(f.parse(a.url).id,10)},a.doms={wrapper:a.wrapper,middleBlock:a.wrapper.find("#middle-block"),title:a.wrapper.find("#title"),info:a.wrapper.find("#info"),content:a.wrapper.find("#content"),sideBlock:a.wrapper.find("#side-block"),sideContent:a.wrapper.find("#side-content"),leftLink:a.wrapper.find("#left-link"),rightLink:a.wrapper.find("#right-link"),topLink:a.wrapper.find("#top-link")},a.getItemListByPage=d.makeList("item",{source:a.data.id},function(b,c){return b?(console.error(b),void 0):(a.dealItemList(c),void 0)})},l.prototype.getChannelInfo=function(){var a=this;d.get("channel",{id:a.data.id},function(b,c){return b?(console.error(b||"No such channel"),void 0):(a.dealChannelInfo(c),void 0)})},l.prototype.dealChannelInfo=function(a){this.data.channel=a,this.renderChannelInfo({channel:a})},l.prototype.getNeighbourInfo=function(){var a=this;d.list("subscription",null,{from:0},function(b,c){if(b||c.length<1)return console.error(b||"Get aside channel info fail."),void 0;for(var d=-1,e=0,f=c.length;f>e;e++)if(parseInt(c[e].id,10)===a.data.id){d=e;break}a.dealNeighbourInfo({prev:c[d-1],next:c[d+1]})})},l.prototype.dealNeighbourInfo=function(a){this.doms.topLink.attr("href",e.home).attr("title","Home"),a.prev?this.doms.leftLink.attr("href",e.channel(a.prev.id)).attr("title",a.prev.title).show():this.doms.leftLink.hide(),a.next?this.doms.rightLink.attr("href",e.channel(a.next.id)).attr("title",a.next.title).show():this.doms.rightLink.hide()},l.prototype.dealItemList=function(a){this.data.items=a,this.renderItemList({items:a})},l.prototype.renderChannelInfo=function(a){this.doms.title.html(i(a)),this.doms.info.html(j(a))},l.prototype.sideBlockLoading=function(){this.doms.sideBlock.addClass("loading")},l.prototype.sideBlockLoad=function(a){this.doms.sideBlock.removeClass("loading"),this.doms.sideContent.html(a)},l.prototype.sideBlockGoto=function(a){var b=a.offset().top+this.doms.middleBlock.scrollTop(),c=parseInt(this.doms.sideBlock.css("top"),10);this.doms.sideBlock.stop().clearQueue().show().delay(200).animate({top:(6*b-c)/5},100).animate({top:b},50)},l.prototype.renderItemList=function(a){var b=this;b.doms.content.html(k(a));var c;h(b.doms.content.find(".item"),"mouseenter",function(){c&&(c=clearTimeout(c));var a=$(this),e=a.attr("data-id");b.doms.sideBlock.attr("data-iid",e),b.sideBlockGoto(a),b.sideBlockLoading(),d.get("item",{id:e},function(a,c){return b.doms.sideBlock.attr("data-iid")==e?a?(b.sideBlockLoad("Get item info failed."),void 0):(b.sideBlockLoad(c.content),void 0):void 0})}),h(b.doms.content,"mouseleave",function(){c=setTimeout(function(){b.doms.sideBlock.hide()},200)})},c.exports=l}),define("nireader/nireader-fe/1.0.0/template/channel/title",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e="<%=channel.title%>";c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/channel/info",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<% if(channel.description){ %><span class="mr20 ml150" title="<%=channel.description%>"><%=channel.description%></span><% } %><span class="mr20">@ <%=formatTime(channel.pubDate)%></span><a class="mr20" href="<%=channel.link%>" target="_blank" title="访问网站">SITE</a>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/channel/itemList",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<ul class="item-list"><%for(i = 0; i < items.length; i ++) {%><li class="item" data-id="<%=items[i].id%>"><a data-link-async="true" data-link-preload="true" href="/item/<%=items[i].id%>"><%=items[i].title%></a><span class="pubdate"><%=formatTime(items[i].pubDate, " ")%></span></li><%}%></ul>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/content/item",["nireader/nireader-fe/1.0.0/kit/resource","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/cache","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/kit/eventList","nireader/nireader-fe/1.0.0/template/item/title","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/item/info","nireader/nireader-fe/1.0.0/template/item/content","nireader/nireader-fe/1.0.0/template/item/channelTitle"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/kit/resource"),e=a("nireader/nireader-fe/1.0.0/interface/index").page,f=a("nireader/nireader-fe/1.0.0/kit/url"),g=a("nireader/nireader-fe/1.0.0/kit/eventList").create("content/item");g.add;var h=a("nireader/nireader-fe/1.0.0/template/item/title"),i=a("nireader/nireader-fe/1.0.0/template/item/info"),j=a("nireader/nireader-fe/1.0.0/template/item/content"),k=a("nireader/nireader-fe/1.0.0/template/item/channelTitle"),l=function(a){this.url=a.url,this.wrapper=a.wrapper,this.type="item"};l.prototype.init=function(){var a=this;a.prepareInfo(),a.getItemInfo(function(){a.getChannelInfo(),a.getNeighbourInfo()}),a.bindEvent()},l.prototype.bindEvent=function(){},l.prototype.clean=function(){g.clean(),this.doms.leftLink.attr("href",""),this.doms.rightLink.attr("href",""),this.doms.topLink.attr("href","")},l.prototype.prepareInfo=function(){var a=this;a.data={id:parseInt(f.parse(a.url).id,10)},a.doms={wrapper:a.wrapper,title:a.wrapper.find("#title"),info:a.wrapper.find("#info"),content:a.wrapper.find("#content"),leftLink:a.wrapper.find("#left-link"),rightLink:a.wrapper.find("#right-link"),topLink:a.wrapper.find("#top-link")}},l.prototype.getItemInfo=function(a){var b=this;d.get("item",{id:b.data.id},function(c,d){return c?(console.error(c||"No such item"),void 0):(b.dealItemInfo(d),a&&a(),void 0)})},l.prototype.getChannelInfo=function(){var a=this;d.get("channel",{id:a.data.item.source},function(b,c){return b?(console.error(b||"Can not get channel"),void 0):(a.dealChannelInfo(c),void 0)})},l.prototype.dealItemInfo=function(a){this.data.item=a,this.renderItemInfo({item:a})},l.prototype.dealChannelInfo=function(a){this.data.channel=a,this.renderChannelInfo({channel:a})},l.prototype.getNeighbourInfo=function(){var a=this;d.list("item",{source:a.data.item.source},{from:0},function(b,c){if(b||c.length<1)return console.error(b||"Get aside item info fail."),void 0;for(var d=-1,e=0,f=c.length;f>e;e++)if(parseInt(c[e].id,10)===a.data.id){d=e;break}a.dealNeighbourInfo({prev:c[d-1],next:c[d+1]})})},l.prototype.dealNeighbourInfo=function(a){a.prev?this.doms.leftLink.attr("href",e.item(a.prev.id)).attr("title",a.prev.title).show():this.doms.leftLink.hide(),a.next?this.doms.rightLink.attr("href",e.item(a.next.id)).attr("title",a.next.title).show():this.doms.rightLink.hide()},l.prototype.renderItemInfo=function(a){this.doms.title.html(h(a)),this.doms.info.html(i(a)),this.doms.content.html(j(a)),this.doms.topLink.attr("href",e.channel(a.item.source))},l.prototype.renderChannelInfo=function(a){this.doms.topLink.attr("title",a.channel.title),this.doms.info.prepend(k(a))},c.exports=l}),define("nireader/nireader-fe/1.0.0/template/item/title",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e="<%=item.title%>";c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/item/info",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<span class="mr40">@ <%=formatTime(item.pubDate)%></span><a class="mr40" href="<%=item.link%>" target="_blank" title="原文">ORIGIN</a>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/item/content",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e="<%==item.content%>";c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/item/channelTitle",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<span class="">From <a href="/channel/<%=channel.id%>" title="<%=channel.description%>" data-link-async=true ><%=channel.title%> </a></span>';
c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/module/floater",["nireader/nireader-fe/1.0.0/kit/keypress","nireader/nireader-fe/1.0.0/kit/pattern","nireader/nireader-fe/1.0.0/kit/request","nireader/nireader-fe/1.0.0/kit/notice","nireader/nireader-fe/1.0.0/kit/url","nireader/nireader-fe/1.0.0/kit/customEvent","nireader/nireader-fe/1.0.0/interface/index","nireader/nireader-fe/1.0.0/template/common/result","nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num","nireader/nireader-fe/1.0.0/template/common/tip","nireader/nireader-fe/1.0.0/template/common/loadingIcon"],function(a){var b,c,d,e=a("nireader/nireader-fe/1.0.0/kit/keypress"),f=a("nireader/nireader-fe/1.0.0/kit/pattern"),g=a("nireader/nireader-fe/1.0.0/kit/request"),h=a("nireader/nireader-fe/1.0.0/kit/notice"),i=a("nireader/nireader-fe/1.0.0/kit/url"),j=a("nireader/nireader-fe/1.0.0/kit/customEvent"),k=a("nireader/nireader-fe/1.0.0/interface/index"),l=k.api,m=k.page,n=a("nireader/nireader-fe/1.0.0/template/common/result"),o=a("nireader/nireader-fe/1.0.0/template/common/tip"),p=a("nireader/nireader-fe/1.0.0/template/common/loadingIcon")(),q=$("#body"),r=$("#floater"),s=$("#input"),t=$("#tips"),u=$("#results"),v=function(){b=s.val().trim()},w=function(){s.val("").focus(),O(),t.hide(),u.hide()},x=function(){q.addClass("blur"),r.addClass("show"),w(),v()},y=function(){q.removeClass("blur"),r.removeClass("show")},z=function(){r.hasClass("show")?y():x()},A=function(){j.trigger("userInfoUpdate")},B=function(){u.html("").hide()},C=function(){t.html("").hide()},D=function(){C(),B()},E=function(a){t.show().prepend(o({tip:{word:a}}))},F=function(a){C(),E(a)},G=function(a,b,c){var b=b||"javascript:;",d=i.isSameDomain(b)?"":"_blank";u.show().append(n({result:{word:a,link:b,target:d,async:c}}))},H=function(a,b){g.post({url:a},l.channel.create,b)},I=function(a,b){g.post({channel:a},l.channel.save,b)},J=function(a,b){g.post({subscribee:a,description:""},l.subscription.add,b)},K=function(){var a=s.val();F("A feed url? parsing... "+p),H(a,function(d,e){if(a===b){if(D(),d)return F("Failed to parse, invalid feed url."),void 0;var f=!!e.id;F("Press <b>Enter</b> to "+(f?"":"add & ")+"subscribe."),G(e.title,f?m.channel(e.id):e.link,f),c=function(){I(e,function(a,b){return a?(F("Failed to add channel. Please try again."),void 0):(F("Channel "+b.title+" added, subscribing... "+p),J(b.id,function(a){return a?(F("Failed to subscribe channel "+b.title+". Please try again."),void 0):(B(),F("Channel "+b.title+" subscribed."),A(),void 0)}),void 0)})}}})},L=function(){F("Press <b>Enter</b> to logout."),c=function(){F(p),g.get(l.auth.out,function(a){return a?(h(a),void 0):(location.href=m.home,void 0)})}},M=function(){F("Press <b>Enter</b> to go to home ('/')."),c=function(){F(p),j.trigger("goto","/"),C()}},N={logout:L,home:M},O=function(){var a=s.val().trim();if(a!=b){if(b=a,D(),a&&N[a])return N[a](),void 0;if(a&&f.url.test(a))return K(),void 0;var c,e,g;if(a)for(var h in N)N.hasOwnProperty(h)&&(c=h.indexOf(a))>=0&&(g=h,e=h.slice(0,c)+"<b>"+a+"</b>"+h.slice(c+a.length)+"	 ---- Use <b>Tab</b>",E(e));d=g&&function(){s.val(g)}}};s.on("keydown",function(a){9===a.which&&(a.preventDefault(),d&&!d(a))}),s.on("keyup",function(a){(13!==a.which||!c||c(a))&&O()}),e.register(27,function(){z()})}),define("nireader/nireader-fe/1.0.0/kit/keypress",[],function(a,b,c){var d={},e=function(a,b,c){var d=a+"";return d+=b?"+ctrl":"",d+=c?"+alt":""},f=function(a,b,c,f){var g=e(a,c,f);d[g]=d[g]||[],d[g].push(b)},g=function(a,b,c,f){var g=e(a,b,c);if(d[g])for(var h=d[g],i=0,j=h.length;j>i;i++)try{h[i](f)}catch(f){}};$("body").on("keyup",function(a){return g(a.which,a.ctrlKey,a.altKey,a),a.preventDefault(),!1}),c.exports={register:f,trigger:g}}),define("nireader/nireader-fe/1.0.0/kit/pattern",[],function(a,b,c){var d=/[a-z]+\:\/\/[\w]+\.[\w]+/;c.exports={url:d}}),define("nireader/nireader-fe/1.0.0/template/common/result",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<li class="result"><a href="<%=result.link%>" target="<%=result.target%>" <%=result.async?"data-link-async=true":""%>><%==result.word%></a></li>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/common/tip",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<li class="tip"><%==tip.word%></li>';c.exports=d.compile(e)}),define("nireader/nireader-fe/1.0.0/template/common/loadingIcon",["nireader/nireader-fe/1.0.0/template/template","nireader/nireader-fe/1.0.0/kit/time","nireader/nireader-fe/1.0.0/kit/num"],function(a,b,c){var d=a("nireader/nireader-fe/1.0.0/template/template"),e='<i class="icon-spinner icon-spin" style="<% if(size){ %>font-size:<%=size*2%>px;<% } %>"></i>',f=d.compile(e);c.exports=function(a){return a=a||{},f(a)}});
