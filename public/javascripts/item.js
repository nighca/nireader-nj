var leftLink = $('#left-link');
var rightLink = $('#right-link');
var itemTitle = $('#item-title');
var itemDate = $('#item-date');
var itemContent = $('#item-content');

var state = {};
var pushState = function(s){
	s = s || state;
	var title = s.curr ? s.curr.title : '>_<';
	var url = s.curr ? s.curr.id+"" : '';
	console.log('push: ', title, url);//-------------------------
	history.pushState(s, title, url);
};
var replaceState = function(s){
	s = s || state;
	var title = s.curr ? s.curr.title : '>_<';
	var url = s.curr ? s.curr.id+"" : '';
	console.log('replace: ', title, url);//-------------------------
	history.replaceState(s, title, url);
};

var itemManager = (function(){
	var items = {};
	return {
		get: function(item, callback){
			if(!item){
				return;
			}
			if(items[item.id]){
				callback && callback(null, items[item.id]);
				return;
			}
			getData('/channel/' + item.source + '/item/' + item.id, function(err, item){
				if(!err){
					items[item.id] = item;
				}
				callback && callback(err, item);
			});
		}
	};
})();

var getItem = itemManager.get;

var init = function(){
	if(!state.cid){
		state.cid = parseInt(getFromLocation('channel'), 10);
	}
	if(!state.iid){
		state.iid = parseInt(getFromLocation('item'), 10);
	}
	getData({cid: state.cid}, '/list/item', function (err, items) {
		items.sort(function(a,b){
			a.pubDate = parseDate(a.pubDate);
			b.pubDate = parseDate(b.pubDate);
			return a.pubDate < b.pubDate;
		});
		if(err){
			dealError('Get item list: ', err);
			return;
		}

		items.forEach(function(item, i){
			if(item.id === state.iid){
				state.prev = items[i-1];
				state.curr = item;
				state.next = items[i+1];
			}
		});

		var adjustLink = function(obj, ele){
			if(obj){
				ele.attr('href', '/channel/'+state.cid+'/item/'+obj.id).show();
			}else{
				ele.hide();
			}
		};
		adjustLink(state.prev, leftLink);
		adjustLink(state.next, rightLink);

		getItem(state.prev, function(err, item){
			if(err){
				dealError('Get item: ', state.prev.title, err);
				return;
			}
			state.prev = item;
		});
		getItem(state.next, function(err, item){
			if(err){
				dealError('Get item: ', state.next.title, err);
				return;
			}
			state.next = item;
		});
	});
};

$(function () {
	init();

	var showItem = function(item, callback){
		$('title').text(item.title);

		itemTitle.animate({
			left: '-100%',
			opacity: '0'
		}, 300).text(item.title).animate({
			left: '100%'
		}, 0).animate({
			left: '0',
			opacity: '1'
		}, 300);

		itemDate.animate({
			left: '-100%',
			opacity: '0'
		}, 300).text(item.pubDate).animate({
			left: '100%'
		}, 0).animate({
			left: '0',
			opacity: '1'
		}, 300);

		itemContent.checkout = function(){
			this.animate({
				left: '-100%',
				opacity: '0'
			}, 300).html(item.content).animate({
				left: '100%'
			}, 0).animate({
				left: '0',
				opacity: '1'
			}, 300);
		};

		if(item.content){
			itemContent.checkout();
			callback && callback();
		}else{
			getItem(item, function(err, item){
				if(err){
					dealError('Get item: ', item.title, err);
					callback && callback();
					return;
				}
				itemContent.checkout();
				//itemContent.html(item.content);
				callback && callback();
			});
		}
	};

	var checkout = function(item, callback){
		if(!item){
			callback && callback();
			return;
		}
		showItem(item, callback);

		state.iid = item.id;
		state.curr = item;
		pushState();
		init();
	};

	window.onpopstate = function(e){
		if(!e.state){
			return;
		}
		state = e.state;
		showItem(state.curr);
		init();
	};

	leftLink.on('click', function(){
		checkout(state.prev);
	});

	rightLink.on('click', function(){
		checkout(state.next);
	});
	
});