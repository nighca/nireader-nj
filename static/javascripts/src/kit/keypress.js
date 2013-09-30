define(function(require, exports, module){
    var eventList = {};

    var format = function(which, ctrl, alt){
        var str = which + '';
        str += ctrl ? '+ctrl' : '';
        str += alt ? '+alt' : '';
        return str;
    };

    var register = function(which, handler, ctrl, alt){
        var name = format(which, ctrl, alt);
        eventList[name] = eventList[name] || [];
        eventList[name].push(handler);
    };

    var trigger = function(which, ctrl, alt, e){
        var name = format(which, ctrl, alt);
        if(eventList[name]){
            var list = eventList[name];
            for (var i = 0, l = list.length; i < l; i++) {
                try{
                    list[i](e);
                }catch(e){}
            };
        }
    };

    $('body').on('keyup', function(e){
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