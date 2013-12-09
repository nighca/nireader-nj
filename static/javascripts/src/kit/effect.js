define(function(require, exports, module){
    var body = $('#body');
    var header = $('#header');
    var floater = $('#floater');

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
        body.addClass('half-transparent');
    };

    var bodyUnblur = function (clear) {
        if(!(clear ? clearCounter : reduceCounter)('bodyBlur')){
            body.removeClass('blur');
            body.removeClass('half-transparent');
        }
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
        bodyBlur: bodyBlur,
        bodyUnblur: bodyUnblur,
        headerBlur: headerBlur,
        headerUnblur: headerUnblur,
        floaterBlur: floaterBlur,
        floaterUnblur: floaterUnblur
    };
});