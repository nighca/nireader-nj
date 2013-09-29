define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<i class="icon-eye-<%=status%>" style="' +
            'font-size:<%=size*2%>px;' +
        '"></i>';

    var render = template.compile(tmpl);
    module.exports = function(data){
        data = data || {};
        data.size = data.size || 10;
        data.status = data.subscribed ? 'open' : 'close';

        return render(data);
    };
});
