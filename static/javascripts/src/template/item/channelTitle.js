define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<span class="">' +
            '来自' +
            '<a href="<%=channel.pageUrl%>" title="<%=channel.description%>" data-link-async=true >' +
                '<%=channel.title%> ' +
            '</a>' +
        '</span>';

    module.exports = template.compile(tmpl);
});
