define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<h3 class="channel-title">' +
            '<%=channel.title%>' +
            '<i id="channel-subscribed" ' +
            'class="icon-eye-<%=channel.subscribed?"open":"close"%>" ' +
            'title="<%=channel.subscribed?"已订阅":"未订阅"%>"></i>' +
        '</h3>' +
        '<p class="channel-description">' +
            '<%=channel.description%>' +
        '</p>' +
        '<p class="channel-generator">' +
            '<%=channel.generator%>' +
        '</p>';

    module.exports = template.compile(tmpl);
});
