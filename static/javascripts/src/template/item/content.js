define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<%==item.content%>';

    module.exports = template.compile(tmpl);
});
