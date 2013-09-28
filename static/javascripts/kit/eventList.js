define(function(require, exports, module){
    var lists = {};

    var create = function(name){
        var list = lists[name] = [];
        return {
            name: name,
            list: list,
            add: function(dom, event, handler){
                dom.on(event, handler);
                list.push({
                    dom: dom,
                    event: event,
                    handler: handler
                });

                return list;
            },
            clean: function(){
                for (var i = list.length - 1, record; i >= 0; i--) {
                    var record = list[i];
                    record.dom.off(record.event, record.handler);
                }
                list = lists[name] = [];
            }
        };
    };

    module.exports = {
        create: create
    };
});
