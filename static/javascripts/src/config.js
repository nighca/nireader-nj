define(function(require, exports, module){
    module.exports = {
        cache: {
            manageInterval: 1000 * 60 * 1, // 1min
            lifetime: 1000 * 60 * 10, // 10min
            maxNum: 100
        },
        resource: {
            lifetime: {
                resource: 1000 * 60 * 60 * 24, // 1day
                list: 1000 * 60 * 60 // 1h
            }
        },
        auth: {
            qq: {
                clientId: '100544244',
                scope: 'get_user_info'
            }
        }
    };
});