define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<li class="result">' +
            '<a href="<%=result.link%>" target="<%=result.target%>" ' +
            '<%=result.async?"data-link-async=true":""%>>' +
                '<%==result.word%>' +
            '</a>'+
        '</li>';

    module.exports = template.compile(tmpl);
});
