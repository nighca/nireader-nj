define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<% if(user.description){ %>' +
        '<span class="mr20 ml150" title="<%=user.description%>">' +
            '<%=user.description%>' +
        '</span>' +
        '<% } %>' +
        '<% if(user.homepage){ %>' +
        '<a class="mr20" href="<%=user.homepage%>" target="_blank" title="页面">' +
            'SITE' +
        '</a>' +
        '<% } %>';

    module.exports = template.compile(tmpl);
});
