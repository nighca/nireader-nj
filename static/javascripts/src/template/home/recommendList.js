define(function(require, exports, module) {
    var template = require('../template');
    var tmpl =
        '<h6 class="sub-title">' +
            '推荐：' +
        '</h6>' +
        '<ul id="recommend-list" class="item-list">' +
            '<%for(i = 0; i < recommends.length; i ++) {%>' +
                '<li class="item" data-id="<%=recommends[i].id%>">' +
                    '<a data-link-async="true" href="<%=recommends[i].pageUrl%>">' +
                        '<%=recommends[i].title%>' +
                        '<span class="pubdate">' +
                            '<%="更新于" + formatTime(recommends[i].pubDate, " ")%>' +
                        '</span>' +
                    '</a>' +
                '</li>' +
            '<%}%>' +
        '</ul>';

    module.exports = template.compile(tmpl);
});
