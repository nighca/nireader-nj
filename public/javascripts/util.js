var $ = $ || (function() {
    console.error("Load jquery fails!");
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

var getFromLocation = function(name){
    var pattern = new RegExp('/' + name + '\\/([\\d\\w]+)(\\/|$)');
    return pattern.exec(location.pathname)[1];
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
    if(typeof data === "string"){
        repeat = callback;
        callback = url;
        url = data;
    }
    if (!callback) {
        callback = function() {};
    }
    $.ajax(url, {
        data: data,
        type: type,
        dataType: "json",
        headers:{
            isAjax: true
        },
        success: function(res) {
            callback(res.error, res.result);
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

var dealError = function(){
    console.error.apply(console, arguments);
};

var parseDate = function(date){
    if(!date){
        return null;
    }
    date = date.getMonth ? date : new Date(date);
    return date;
};

var getDayObj = function(t){
    if(!t){
        t = new Date();
    }

    return {
        y: t.getFullYear(),
        m: t.getMonth() + 1,
        d: t.getDate(),
        value: t.valueOf()
    };
};

//--------------------------------------- add-on funcs -----------------------------------------

if ( !Array.prototype.forEach ) {

  Array.prototype.forEach = function forEach( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) !== "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( Object.prototype.hasOwnProperty.call(O, k) ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
};