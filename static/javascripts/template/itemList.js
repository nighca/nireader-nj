define(function(require, exports, module) {
    var channelTmpl =
        '<ul class="item-list">' +
            '<%for(i = 0; i < list.length; i ++) {%>' +
                '<li>' +
                    '<a data-link-async="true" data-link-preload="true" href="/channel/<%=channel.id%>/item/<%=list[i].id%>">' +
                        '<%=list[i].title%>' +
                    '</a>' +
                    '<span class="pubdate">' +
                        '<%=list[i].date%>' +
                    '</span>' +
                '</li>' +
            '<%}%>' +
        '</ul>';

    module.exports = template.compile(channelTmpl);
});
