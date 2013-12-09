define(function(require, exports, module){
    var Task = require('../task');
    var local = require('../../kit/local').create('logger');

    module.exports = new Task('logger', function(task){
        local.set('time', Date.now());

        LOG('log', local.getAll());
    }, 1000 * 60);
});