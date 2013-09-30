define(function(require, exports, module) {
    var formatTime = require('../kit/time').format;

    template.helper('formatTime', formatTime);

    module.exports = template;
});