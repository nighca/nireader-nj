var User = require('../src/model/user');

var user = User.create({
    name: 'test user',
    avatar: 'http://nighca.me',
    description: 'for test'
});

user.save(function(){
    user.title += ' update!';
    user.save(function(){
        User.select({}, function (err, results) {
            console.log(err);
            console.log(results);
            user.remove();
            process.exit();
        });
    });
});
