var User = require('../src/model/user');

var user = User.create({
    name: 'nighca',
    mail: 'nighca@live.cn',
    password: '123456',
    description: 'for test'
});

user.save(function(){
    user.description += ' update!';
    user.save(function(){
        User.select({}, function (err, results) {
            console.log(err);
            console.log(results);

            //user.remove();
            //process.exit();
        });
    });

    User.ifExist({name:'nighca'}, function(err){
        console.log('nighca', err);
    });
    User.ifExist({name:'nighca2'}, function(err){
        console.log('nighca2', err);
    });
    User.ifRight('nighca', '123456', function(err, user){
        console.log('nighca', '123456', err, user);
    });
    User.ifRight('nighca', '1234567', function(err, user){
        console.log('nighca', '1234567', err, user);
    });
    User.ifRight('nighco', '123456', function(err, user){
        console.log('nighco', '123456', err, user);
    });
});

