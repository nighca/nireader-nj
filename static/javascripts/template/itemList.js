define(function(require, exports, module) {
    var itemListTmpl =
        '<ul class="item-list">' +
            '<%for(i = 0; i < items.length; i ++) {%>' +
                '<li>' +
                    '<a data-link-async="true" data-link-preload="true" href="/item/<%=items[i].id%>">' +
                        '<%=items[i].title%>' +
                    '</a>' +
                    '<span class="pubdate">' +
                        '<%=items[i].pubDate%>' +
                    '</span>' +
                '</li>' +
            '<%}%>' +
        '</ul>';

    module.exports = template.compile(itemListTmpl);
});
