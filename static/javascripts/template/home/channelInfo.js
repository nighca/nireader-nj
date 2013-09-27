define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<h3>' +
            '<%=channel.title%>' +
        '</h3>' +
        '<p>' +
            '<%=channel.description%>' +
        '</p>' +
        '<p>' +
            '<%=channel.generator%>' +
        '</p>';

    module.exports = template.compile(tmpl);
});
