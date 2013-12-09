/*! dev 07-08-2013 by nighca@live.cn */
window.DEV=location.href.indexOf("?dev")>0,window.LOG=function(){window.DEV&&console.log&&console.log.apply&&console.log.apply(console,arguments)};