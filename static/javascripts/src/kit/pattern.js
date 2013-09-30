define(function(require, exports, module){ 
    var urlPattern = /[a-z]+\:\/\/[\w]+\.[\w]+/;

    module.exports = {
        url: urlPattern
    };
});