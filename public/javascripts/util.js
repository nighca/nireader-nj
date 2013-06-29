var $ = $ || (function() {
    console.log("Load jquery fails!");
    return null;
}());

var getNavigator = function() {
    var userAgent = navigator.userAgent.toLowerCase(),
        s, o = {};
    var browser = {
        version: parseInt(userAgent.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[1], 10),
        safari: /version.+safari/.test(userAgent),
        chrome: /chrome/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        ie: /msie/.test(userAgent),
        opera: /opera/.test(userAgent)
    };
    return browser;
};

var refresh = function(){
    window.location.reload();
};

var format = function(num, hex, units, dec) {
    num = num || 0;
    dec = dec || 0;
    var level = 0;
    while (num >= hex) {
        num /= hex;
        level++;
    }

    if (level === 0) {
        dec = 0;
    }

    return {
        "base": num.toFixed(dec),
        "unit": units[level],
        "format": function(sep) {
            sep = sep || "";
            return this.base + sep + this.unit;
        }
    };
};

var numFormat = function(num, n) {
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

var maxRepeatNum = 3;
var doRequest = function(type, data, url, callback, repeat) {
    //if(typeof repeat === "undefined") repeat = defaultRepeatNum;
    if (!callback) {
        callback = function() {};
    }
    $.ajax(url, {
        data: data,
        type: type,
        dataType: "json",
        success: function(res) {
            callback(res.err, res.result);
        },
        error: function(err) {
            if (repeat === true) {
                repeat = maxRepeatNum;
            }
            if (typeof repeat === "number" && repeat > 0) {
                doRequest(type, data, url, callback, --repeat);
            }else{
                callback(err, null);
            }
        }
    });
};
var postData = function(data, url, callback, repeat) {
    doRequest("post", data, url, callback, repeat);
};
var getData = function(data, url, callback, repeat) {
    doRequest("get", data, url, callback, repeat);
};