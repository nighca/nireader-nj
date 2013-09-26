define(function(require, exports, module) {
    var resource = {
        channel: {
            get: '/api/channel',
            list: '/api/list/channel'
        },
        item: {
            get: '/api/item',
            list: '/api/list/item'
        },
        subscription: {
            get: '/api/subscription'
        },
        user: {
            get: '/api/user'
        }
    };

    module.exports = {
        resource: resource
    };
});