define(function(require, exports, module){
    var lists = {};

    var create = function(name){
        name += (Math.random() + '').slice(2);
        var list = lists[name] = [];
        LOG('create eventList: ', name);
        return {
            name: name,
            list: list,
            add: function(dom, event, handler){
                for (var i = list.length - 1; i >= 0; i--) {
                    if(list[i].dom === dom && list[i].event === event && list[i].handler === handler){
                        return;
                    }
                }
                try{
                    dom.on(event, handler);
                    list.push({
                        dom: dom,
                        event: event,
                        handler: handler
                    });
                    LOG('add event: ', event, ' to ', this);
                }catch(e){
                    console.log(e.stack);
                }

                return list;
            },
            remove: function(dom, event, handler){
                for (var i = list.length - 1; i >= 0; i--) {
                    if(list[i].dom === dom && list[i].event === event && list[i].handler === handler){
                        try{
                            dom.off(event, handler);
                            list.splice(i, 1);
                            LOG('remove event: ', event, ' from ', this);
                        }catch(e){
                            console.log(e.stack);
                        }
                        break;
                    }
                }
            },
            clean: function(){
                LOG('clean eventList: ', this);

                for (var i = list.length - 1, record; i >= 0; i--) {
                    try{
                        record = list[i];
                        record.dom.off(record.event, record.handler);
                    }catch(e){
                        console.log(e.stack);
                    }
                }

                list = lists[name] = [];
                delete lists[name];
            }
        };
    };

    module.exports = {
        create: create
    };
});
