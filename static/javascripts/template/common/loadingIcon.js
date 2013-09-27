define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<i class="icon-spinner icon-spin icon-large" style="' +
            'font-size:<%=size*2%>px;' +
            'margin-left:-<%=size*1.3%>px' +
            'margin-top:-<%=size*1.3%>px' +
        '"></i>';

    var render = template.compile(tmpl);
    module.exports = function(data){
        data = data || {
            size: 10
        };

        return render(data);
    };
});
