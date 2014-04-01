define(function(require, exports, module){
    var body = $('#body');
    var header = $('#header');
    var floater = $('#floater');

    $('body').prepend(require('../template/common/loader')());
    var loader = $('#loader');

    // counter to simulate multi-layer effect
    var counter = {};

    var reduceCounter = function(name){
        counter[name] = counter[name] || 0;
        counter[name] = counter[name] > 0 ? counter[name] - 1 : 0;
        return counter[name];
    };

    var increaseCounter = function(name){
        counter[name] = counter[name] || 0;
        counter[name]++;
        return counter[name];
    };

    var clearCounter = function(name){
        counter[name] = 0;
        return counter[name];
    };

    var getCounter = function(name){
        return counter[name];
    };

    // effects

    var bodyBlur = function () {
        increaseCounter('bodyBlur');
        body.addClass('blur');
        bodyTransparent();
    };

    var bodyUnblur = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('bodyBlur')){
            body.removeClass('blur');
        }
        bodyUntransparent(clear);
    };

    var bodyLoading = function () {
        increaseCounter('bodyLoading');
        loader.show();
        bodyBlur();
    };

    var bodyUnloading = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('bodyLoading')){
            loader.hide();
        }
        // 此处有bug！！！
        bodyUnblur(clear);
    };

    var headerBlur = function () {
        increaseCounter('headerBlur');
        header.addClass('blur');
    };

    var headerUnblur = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('headerBlur')){
            header.removeClass('blur');
        }
    };

    var floaterBlur = function () {
        increaseCounter('floaterBlur');
        floater.addClass('blur');
    };

    var floaterUnblur = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('floaterBlur')){
            floater.removeClass('blur');
        }
    };

    var bodyTransparent = function () {
        increaseCounter('bodyTransparent');
        body.addClass('half-transparent');
    };

    var bodyUntransparent = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('bodyTransparent')){
            body.removeClass('half-transparent');
        }
    };

    module.exports = {
        bodyBlur: bodyTransparent,
        bodyUnblur: bodyUntransparent,
        bodyLoading: bodyLoading,
        bodyUnloading: bodyUnloading,
        headerBlur: headerBlur,
        headerUnblur: headerUnblur,
        floaterBlur: floaterBlur,
        floaterUnblur: floaterUnblur
    };
});