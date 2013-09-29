define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<%=item.title%>';

    module.exports = template.compile(tmpl);
});
