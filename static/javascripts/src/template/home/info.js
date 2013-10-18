define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<% if(user.description){ %>' +
        '<span class="mr20 ml150" title="<%=user.description%>">' +
            '<%=user.description%>' +
        '</span>' +
        '<% } %>' +
        '<% if(user.homepage){ %>' +
        '<a class="mr20" href="<%=user.homepage%>" target="_blank" title="站点">' +
            '站点' +
        '</a>' +
        '<% } %>';

    module.exports = template.compile(tmpl);
});
