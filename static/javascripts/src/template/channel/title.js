define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<%=channel.title%>';

    module.exports = template.compile(tmpl);
});
