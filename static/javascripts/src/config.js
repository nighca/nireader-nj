define(function(require, exports, module){
    module.exports = {
        cache: {
            manageInterval: 1000 * 60 * 1, // 1min
            lifetime: 1000 * 60 * 1, // 1min
            maxNum: 100
        },
        resource: {
            lifetime: {
                resource: 1000 * 60 * 60, // 1h
                list: 1000 * 60 // 1min
            }
        }
    };
});