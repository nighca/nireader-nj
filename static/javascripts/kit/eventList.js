define(function(require, exports, module){
    var lists = {};

    var create = function(name){
        var list = lists[name] = [];
        return {
            name: name,
            list: list,
            add: function(dom, event, handler){
                try{
                    dom.on(event, handler);
                    list.push({
                        dom: dom,
                        event: event,
                        handler: handler
                    });
                }catch(e){
                    console.log(e.stack);
                }

                return list;
            },
            clean: function(){
                try{
                    for (var i = list.length - 1, record; i >= 0; i--) {
                        var record = list[i];
                        record.dom.off(record.event, record.handler);
                    }
                }catch(e){
                    console.log(e.stack);
                }
                list = lists[name] = [];
            }
        };
    };

    module.exports = {
        create: create
    };
});
