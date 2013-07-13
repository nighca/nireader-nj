$(function () {
	if(typeof obj !== "undefined"){
		var wrapper = $('body');

	    var itemUrlPattern = /\/channel\/[\d\w]+\/item\/[\d\w]+/;
		var isItem = itemUrlPattern.test(location.pathname);

		var Cnt = isItem ? Item : Channel;

		var stateManager = new StateManager({
			obj: new Cnt(obj, location.pathname),
			wrapper: wrapper
		});
	}
});