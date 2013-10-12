define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<ul id="subscription-list" class="item-list">' +
        '<%if(subscriptions && subscriptions.length > 0){%>' +
            '<h6 class="sub-title">' +
                'Subscriptions: ' +
            '</h6>' +
            '<%for(i = 0; i < subscriptions.length; i ++) {%>' +
                '<li class="item" data-id="<%=subscriptions[i].id%>">' +
                    '<a data-link-async="true" href="/channel/<%=subscriptions[i].id%>">' +
                        '<%=subscriptions[i].title%>' +
                    '</a>' +
                    '<span class="pubdate">' +
                        '<%="更新于" + formatTime(subscriptions[i].pubDate, " ")%>' +
                    '</span>' +
                '</li>' +
            '<%}%>' +
        '<%}else{%>' +
        '<h6 class="sub-title">' +
            'No subscription yet, ' +
        '</h6>' +
        '<%}%>' +
        '</ul>';

    module.exports = template.compile(tmpl);
});
