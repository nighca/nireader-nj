define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<p class="word">' +
            '<%==notice.word%>' +
        '</p>' +
        '<p class="op">' +
            '<button id="confirm">OK</button>' +
        '</p>';

    module.exports = template.compile(tmpl);
});
