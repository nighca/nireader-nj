define(function(require, exports, module){
    var handlers = {};

    var protocol = 'nireader';
        protocolPrefix = protocol + '://';
        protocolPrefixLen = protocolPrefix.length;

    module.exports = {
        on: function(name, handler){
            var list = handlers[name] = handlers[name] || [];

            // avoid repeated bind
            if(list.indexOf(handler) >= 0){
                return;
            }

            list.push(handler);
        },
        off: function(name, handler){
            var list, pos;
            if(list = handlers[name]){
                if((pos = list.indexOf(handler)) >= 0){
                    list.splice(pos, 1);
                }
            }
        },
        trigger: function(name){
            var list;
            if(list = handlers[name]){
                for (var i = 0, l = list.length; i < l; i++) {
                    try{
                        list[i].apply(null, Array.prototype.slice.call(arguments, 1));
                    }catch(e){
                        console.log(e.stack);
                    }
                }
            }
        },
        enable: function(){
            var _this = this;

            $(document).delegate('[href]', 'click', function(e){
                var link = $(this);
                if((link = link.attr('href')).indexOf(protocolPrefix) === 0){
                    e.preventDefault();

                    var args = link.slice(protocolPrefixLen).split('.').map(function(arg){
                        arg = decodeURIComponent(arg);
                        try{
                            arg = JSON.parse(arg);
                        }catch(e){
                        }

                        return arg;
                    });

                    _this.trigger.apply(_this, args);
                }
            });
        }
    };

    module.exports.enable();
});
