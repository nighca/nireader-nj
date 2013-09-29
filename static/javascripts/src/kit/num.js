define(function(require, exports, module){
    var toLength = function(num, l){
        var str = (num + '').slice(0, l);
        if(str.length < l){
            for(var i = str.length; i < l; i++){
                str = '0' + str;
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