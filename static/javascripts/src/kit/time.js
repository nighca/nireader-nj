define(function(require, exports, module) {
    var toLength = require('./num').toLength;

    var getTodayBegin = function(){
        var t = new Date();
        t.setMilliseconds(0);
        t.setSeconds(0);
        t.setMinutes(0);
        t.setHours(0);
        return t;
    };

    var thisYear = (new Date()).getFullYear();
    var todayBegin = getTodayBegin();

    var update = setInterval(function(){
        thisYear = (new Date()).getFullYear();
        todayBegin = getTodayBegin();
    }, 60 * 1000);

    var daysAgo = function(t, i){
        var time = new Date(t.valueOf());
        time.setDate(time.getDate() - i);
        return time;
    };

    var dayList = ['今天', '昨天', '天前'];
    var numList = ['零', '一', '两', '三', '四', '五'];

    var formatDateTime = function(t){
        if(t > todayBegin){
            return dayList[0];
        }else if(t > daysAgo(todayBegin, 1)){
            return dayList[1];
        }else{
            for(var i = 2; i <= 5; i++){
                if(t > daysAgo(todayBegin, i)){
                    return numList[i] + dayList[2];
                }
            }
            
            var str = '';
            var y = t.getFullYear();
            var m = toLength(t.getMonth() + 1, 2);
            var d = toLength(t.getDate(), 2);
            if(y !== thisYear){
                str += y + '年';
            }
            str += m + '月' + d + '日';

            return str;
        }
    };

    var formatDayTime = function(t){
        return toLength(t.getHours(), 2) +
            ':' +
            toLength(t.getMinutes(), 2);
    };

    var format = function(time, seperator){
        var t = new Date(time);
        seperator = seperator === undefined ? '' : seperator;
        
        return formatDateTime(t) + seperator + formatDayTime(t);
    };

    exports.formatDate = formatDateTime;
    exports.formatDay = formatDayTime;
    exports.format = format;
});