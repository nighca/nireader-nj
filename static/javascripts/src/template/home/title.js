define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<%=user.name%>';

    module.exports = template.compile(tmpl);
});
