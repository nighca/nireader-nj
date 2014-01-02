define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<ul id="subscription-list" class="item-list">' +
        '<%if(subscriptions && subscriptions.length > 0){%>' +
            '<h6 class="sub-title">' +
                '订阅：' +
            '</h6>' +
            '<%for(i = 0; i < subscriptions.length; i ++) {%>' +
                '<li class="item" data-id="<%=subscriptions[i].id%>" data-news="<%=subscriptions[i].news%>">' +
                    '<a data-link-async="true" href="<%=subscriptions[i].pageUrl%>">' +
                        '<%=subscriptions[i].title%>' +
                        '<span class="pubdate">' +
                            '<%="更新于" + formatTime(subscriptions[i].pubDate, " ")%>' +
                        '</span>' +
                    '</a>' +
                '</li>' +
            '<%}%>' +
        '<%}else{%>' +
        '<h6 class="sub-title">' +
            '没有订阅，' +
        '</h6>' +
        '<%}%>' +
        '</ul>';

    module.exports = template.compile(tmpl);
});
