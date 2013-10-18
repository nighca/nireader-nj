define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<% if(channel.description){ %>' +
        '<span class="mr20 ml150" title="<%=channel.description%>">' +
            '<%=channel.description%>' +
        '</span>' +
        '<% } %>' +
        '<span class="mr20">' +
            '更新于<%=formatTime(channel.pubDate)%>' +
        '</span>' +
        '<a class="mr20" href="<%=channel.link%>" target="_blank" title="站点">' +
            '站点' +
        '</a>';

    module.exports = template.compile(tmpl);
});
