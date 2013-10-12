define(function(require, exports, module){

    exports.bottom = function(dom) {
        // if a jquery obj
        dom = dom[0] || dom;
        return dom && dom.scrollTop + dom.clientHeight >= dom.scrollHeight;
    };

    exports.top = function(dom) {
        // if a jquery obj
        dom = dom[0] || dom;
        return dom && dom.scrollTop <= 0;
    };
});