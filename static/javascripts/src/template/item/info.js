define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<span class="mr40">' +
            '@ <%=formatTime(item.pubDate)%>' +
        '</span>' +
        '<a class="mr40" href="<%=item.link%>" target="_blank" title="原文">' +
            'ORIGIN' +
        '</a>';

    module.exports = template.compile(tmpl);
});
