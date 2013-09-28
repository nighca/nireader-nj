define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<li class="tip">' +
            '<%==tip.word%>' +
        '</li>';

    module.exports = template.compile(tmpl);
});
