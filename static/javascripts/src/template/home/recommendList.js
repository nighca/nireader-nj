define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<h6 class="sub-title">' +
            'Recommend:' +
        '</h6>' +
        '<ul id="recommend-list" class="item-list">' +
            '<%for(i = 0; i < recommends.length; i ++) {%>' +
                '<li class="item" data-id="<%=recommends[i].id%>">' +
                    '<a data-link-async="true" href="/channel/<%=recommends[i].id%>">' +
                        '<%=recommends[i].title%>' +
                    '</a>' +
                    '<span class="pubdate">' +
                        '<%="更新于" + formatTime(recommends[i].pubDate, " ")%>' +
                    '</span>' +
                '</li>' +
            '<%}%>' +
        '</ul>';

    module.exports = template.compile(tmpl);
});
