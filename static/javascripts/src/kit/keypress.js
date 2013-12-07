define(function(require, exports, module){
    var eventList = {};

    var keyCode = {
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'enter': 13,
        'backspace': 8
    };

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

    var unregister = function(which, handler, ctrl, alt){
        var name = format(which, ctrl, alt), list, pos;
        if((list = eventList[name]) && ((pos = list.indexOf(handler)) >= 0)){
            list.splice(pos, 1);
        }
    };

    var trigger = function(which, ctrl, alt, e){
        var name = format(which, ctrl, alt);
        if(eventList[name]){
            var list = eventList[name];
            for (var i = 0, l = list.length; i < l; i++) {
                try{
                    list[i](e);
                }catch(e){}
            }
        }
    };

    $('body').on('keyup', function(e){
        LOG('keypress', e.which, e.ctrlKey, e.altKey, e);
        trigger(e.which, e.ctrlKey, e.altKey, e);

        //e.preventDefault();
        return false;
    });

    var on = function(opt, handler){
        if(opt = (typeof opt === 'number' ? {which: opt} : opt)){
            return register(opt.which, handler, opt.ctrl, opt.alt);
        }
    };

    var off = function(opt, handler){
        if(opt = (typeof opt === 'number' ? {which: opt} : opt)){
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