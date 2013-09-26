define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<span class="">' +
            'From ' +
            '<a href="/channel/<%=channel.id%>" title="<%=channel.description%>" data-link-async=true >' +
            	'<%=channel.title%> ' +
            '</a>' +
        '</span>';

    module.exports = template.compile(tmpl);
});
