$(function () {
	var signin = !!$('#user-info'), uid;
	if(signin){
		uid = $('#user-info').attr('data-uid');
	}

	//adjust element status
	var allChannels = $('#all-channels').find('[data-cid]');
	var subscribedChannels = $('#subscribed-channels').find('[data-cid]');

	subscribedChannels.each(function(i, channel){
		var cid = $(channel).attr('data-cid');
		allChannels.filter('[data-cid='+cid+']').find('.subscribe').hide();
	});
	

	// binding ops

	$('.subscribe').on('click', function(e){
		if(!signin){
			alert('signin, plz.');
			return false;
		}
		var cid = $(this).parent().attr('data-cid');
		postData({subscriber:uid,subscribee:cid}, '/subscribe/', function(err, result){
			if(err){
				console.error('ERR: ', err);
				return;
			}
			console.log('Subscribed.');
			refresh();
		});
	});

	$('.unsubscribe').on('click', function(e){
		if(!signin){
			alert('signin, plz.');
			return false;
		}
		var cid = $(this).parent().attr('data-cid');
		postData({subscriber:uid,subscribee:cid}, '/unsubscribe/', function(err, result){
			if(err){
				console.error('ERR: ', err);
				return;
			}
			console.log('Unsubscribed.');
			refresh();
		});
	});
});