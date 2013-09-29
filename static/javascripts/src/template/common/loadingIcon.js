define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<i class="icon-spinner icon-spin" style="' +
            '<% if(size){ %>' +
            'font-size:<%=size*2%>px;' +
            '<% } %>' +
        '"></i>';

    var render = template.compile(tmpl);
    module.exports = function(data){
        data = data || {};

        return render(data);
    };
});
