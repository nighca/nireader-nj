define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<div id="loader" class="loader" style="' +
            '<% if(size){ %>' +
            'width:<%=size%>px;' +
            'height:<%=size%>px;' +
            '<% } %>' +
        '"></div>';

    var render = template.compile(tmpl);
    module.exports = function(data){
        data = data || {};

        return render(data);
    };
});
