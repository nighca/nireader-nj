define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<ul id="subscription-list" class="item-list">' +
            '<%for(i = 0; i < subscriptions.length; i ++) {%>' +
                '<li class="item" data-id="<%=subscriptions[i].id%>">' +
                    '<a data-link-async="true" data-link-preload="true" href="/channel/<%=subscriptions[i].id%>">' +
                        '<%=subscriptions[i].title%>' +
                    '</a>' +
                    '<span class="pubdate">' +
                        '<%="更新于" + formatTime(subscriptions[i].pubDate, " ")%>' +
                    '</span>' +
                '</li>' +
            '<%}%>' +
        '</ul>';

    module.exports = template.compile(tmpl);
});
