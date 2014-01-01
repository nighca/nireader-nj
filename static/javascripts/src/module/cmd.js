define(function(require, exports, module) {
    var customEvent = require('../kit/customEvent');
    var userinfo = require('../kit/userinfo');
    var cache = require('../kit/cache');

    var interfaces = require('../interface/index');
    var pages = interfaces.page;

    var loadingIcon = require('../template/common/loadingIcon')();

    var toLength = function(str, l, add){
        if(str.length < l){
            for(var i = str.length; i < l; i++){
                str = str + add;
            }
        }
        return str;
    };

    var dealCmd = function(input, tip, result){
        return function(){
            tip.show('正在获取... ' + loadingIcon);
            setTimeout(function(){
                for(var cmd in cmds) if(cmds.hasOwnProperty(cmd)){
                    result.add(
                        '<span class="code-font">' +
                        cmd +
                        '</span><span class="add-on">' +
                        cmds[cmd].usage +
                        '</span>',
                        'nireader://global-input.' + cmd
                    );
                }
                tip.clean();
            }, 300);
        };
    };

    var dealLogout = function(input, tip, result){
        return function(){
            tip.show('正在登出... ' + loadingIcon);
            userinfo.logout(function(err){
                if(err){
                    notice('出错了。');
                    LOG(err);
                    return;
                }
                location.href = pages.home;
            });
        };
    };

    var dealHome = function(input, tip, result){
        return function(){
            tip.show('正在去首页... ' + loadingIcon);
            customEvent.trigger('goto', '/');
            tip.clean();
        };
    };

    var dealCache = function(input, tip, result){
        return function(){
            tip.show('正在计算... ' + loadingIcon);
            var size = cache.getSize();
            setTimeout(function(){
                result.add(['共', size.num, '条缓存记录'].join(' '));
                result.add(['占用存储空间', size.MB, 'MB'].join(' '));
                tip.clean();
            }, 300);
        };
    };

    var dealNoCache = function(input, tip, result){
        return function(){
            tip.show('正在清除缓存... ' + loadingIcon);
            var originSize = cache.getSize().MB + 'MB';
            cache.clear();
            var currSize = cache.getSize().MB + 'MB';
            setTimeout(function(){
                tip.show('缓存已清空。（' + originSize + '->' + currSize + '）');
            }, 300);
        };
    };


    var cmds = module.exports = {
        'cmd': {
            usage: '查看所有命令',
            handler: dealCmd
        },
        'logout': {
            usage: '登出',
            handler: dealLogout
        },
        'home': {
            usage: '去首页 (\'/\')',
            handler: dealHome
        },
        'cache': {
            usage: '查看缓存统计',
            handler: dealCache
        },
        'nocache': {
            usage: '清除缓存',
            handler: dealNoCache
        },
        'nighca': {
            nohint: true,
            handler: function(input, tip, result){
                return function(){
                    result.add('>_<...');
                    location.href = "http://nighca.me/nighca/";
                };
            }
        }
    };
});