define(function(require, exports, module){
    var Task = require('../task');

    module.exports = new Task('breath', function(task){
        $('#body').addClass('breath');
    });
});