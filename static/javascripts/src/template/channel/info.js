define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<% if(channel.description){ %>' +
        '<span class="mr20 ml150" title="<%=channel.description%>">' +
            '<%=channel.description%>' +
        '</span>' +
        '<% } %>' +
        '<span class="mr20">' +
            '@ <%=formatTime(channel.pubDate)%>' +
        '</span>' +
        '<a class="mr20" href="<%=channel.link%>" target="_blank" title="访问网站">' +
            'SITE' +
        '</a>';

    module.exports = template.compile(tmpl);
});
