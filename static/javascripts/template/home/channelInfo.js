define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<h3 class="channel-title">' +
            '<%=channel.title%>' +
            '<i id="channel-subscribed" class="icon-eye-<%=channel.subscribed?"open":"close"%>"></i>' +
        '</h3>' +
        '<p class="channel-description">' +
            '<%=channel.description%>' +
        '</p>' +
        '<p class="channel-generator">' +
            '<%=channel.generator%>' +
        '</p>';

    module.exports = template.compile(tmpl);
});
