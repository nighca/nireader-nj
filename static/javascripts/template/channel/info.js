define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<span class="date">' +
            '更新于<%=formatTime(channel.pubDate)%>' +
        '</span>' +
        '<a class="link" href="<%=channel.link%>" target="_blank">' +
            'ORIGIN' +
        '</a>';

    module.exports = template.compile(tmpl);
});
