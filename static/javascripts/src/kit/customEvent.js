define(function(require, exports, module){
    var lists = {};

    module.exports = {
        on: function(event, handler){
            var list = lists[event] = lists[event] || [];

            // avoid repeated bind
            if(list.indexOf(handler) >= 0){
                return;
            }

            list.push(handler);
        },
        off: function(event, handler){
            var list, pos;
            if(list = lists[event]){
                if((pos = list.indexOf(handler)) >= 0){
                    list.splice(pos, 1);
                }
            }
        },
        trigger: function(event){
            var list;
            if(list = lists[event]){
                for (var i = 0, l = list.length; i < l; i++) {
                    try{
                        list[i].apply(null, Array.prototype.slice.call(arguments, 1));
                    }catch(e){
                        console.log(e.stack);
                    }
                }
            }
        }
    };
});
