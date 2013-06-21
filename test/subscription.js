var User = require('../src/model/user');
var Channel = require('../src/model/channel');
var Subscription = require('../src/model/subscription');

var user = User.create({
    name: 'test user',
    avatar: 'http://nighca.me',
    description: 'for test'
});

var channel = Channel.create({
    title: 'test channel',
    link: 'http://log.nighca.me',
    source: 'http://log.nighca.me/feed/',
    description: 'for test',

    language : 'Chinese',
    copyright : 'none',
    pubDate : new Date(),
    category : 'Test',
    generator : 'nodejs',
    webMaster : 'nighca@live.cn'
});

var channel2 = Channel.create({
    title: 'test channel 2',
    link: 'http://log.nighca.me',
    source: 'http://log.nighca.me/feed/',
    description: 'for test',

    language : 'Chinese',
    copyright : 'none',
    pubDate : new Date(),
    category : 'Test',
    generator : 'nodejs',
    webMaster : 'nighca@live.cn'
});

var subscription1, subscription2;

var checkResult = function(err, results){
    if(err){
        console.error(err);
        return;
    }
    console.log(results);
};

user.save(function(err){
    if(err){
        console.error(err);
        return;
    }
    channel.save(function(err){
        if(err){
            console.error(err);
            return;
        }

        channel2.save(function(err){
            if(err){
                console.error(err);
                return;
            }

            subscription1 = Subscription.create({
                description : 'subscription 1 for test',
                subscriber : user.id,
                subscribee : channel.id
            });
            subscription2 = Subscription.create({
                description : 'subscription 2 for test',
                subscriber : user.id,
                subscribee : channel2.id
            });

            subscription1.save(function(err){
                if(err){
                    console.error(err);
                    return;
                }

                subscription2.save(function(err){
                    if(err){
                        console.error(err);
                        return;
                    }

                    user.getSubscriptions(checkResult);
                    user.getChannels(checkResult);
                });
            });
        });
    });
});

setTimeout(function(){
    user.remove();
    channel.remove();
    channel2.remove();
    subscription1.remove();
    subscription2.remove();
}, 2000);
