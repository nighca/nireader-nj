define(function(require, exports, module){

    var maxRepeatNum = 3;

    var doRequest = function(type, data, url, callback, repeat) {
        if(typeof data === "string"){
            repeat = callback;
            callback = url;
            url = data;
            data = null;
        }
        $.ajax(url, {
            data: data,
            type: type,
            dataType: "json",
            headers:{
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
                }else{
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