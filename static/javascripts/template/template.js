define(function(require, exports, module) {
	var toLength = require('../kit/num').toLength;

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
    	t.setDate(t.getDate() - i);
    	return t;
    };

    var formatDateTime = function(t){
    	var str = '';
    	var y = t.getFullYear();
    	var m = toLength(t.getMonth() + 1, 2);
    	var d = toLength(t.getDate(), 2);
    	if(y !== thisYear){
    		str += thisYear + '年';
    	}
    	str += m + '月' + d + '日';
    };

    var formatDayTime = function(t){
    	return toLength(t.getHours(), 2) + ':' +
    		toLength(t.getMinutes(), 2);
    		//toLength(t.getSeconds(), 2);
    };

    var dayList = ['今天', '昨天', '天前'];
    var numList = ['零', '一', '二', '三', '四', '五'];

	template.helper('formatTime', function(time){
		var t = new Date(time);
		var dayTime = formatDayTime(t);

		if(t > todayBegin){
			return dayList[0] + ' ' + dayTime;
		}else if(t > daysAgo(todayBegin, 1)){
			return dayList[1] + ' ' + dayTime;
		}else{
			for(var i = 2; i <= 5; i++){
				if(t > daysAgo(todayBegin, i)){
					return numList[i] + dayList[2] + ' ' + dayTime;
				}
			}
			return formatDateTime(t) + ' ' + dayTime;
		}
	});

	module.exports = template;
});