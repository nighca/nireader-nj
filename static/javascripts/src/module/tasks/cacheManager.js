define(function(require, exports, module){
    var Task = require('../task');
    var autoManageInterval = require('../../config').cache.manageInterval;
    var cache = require('../../kit/cache');

    module.exports = new Task('cacheManager', cache.manage.bind(cache), autoManageInterval);
});