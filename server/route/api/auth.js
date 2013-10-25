var https = require('https');
var http = require('http');
var format = require('url').format;
var User = require('../../model/user');
var config = require('../../config/auth');

var getThirdPartyInfo = function(thirdParty, params, callback){
    if(!config[thirdParty]){
        callback && callback('不支持该账号类型');
    }

    var url = config[thirdParty].api.getInfo;
    var client = url.indexOf('https') === 0 ? https : http;

    switch(thirdParty){
    case 'qq':
        url += '?';
        url += 'access_token=' + params.accessToken + '&';
        url += 'oauth_consumer_key=' + config[thirdParty].clientId +'&';
        url += 'openid=' + params.openId + '&';
        url += 'format=json';

        client.get(url, function(res){
            res.on('data', function(data){
                data = JSON.parse(data.toString());
                callback && callback(null, data);
            });
        }).on('error', callback);
        break;
    default:
    }
};

var dealThirdParty = function(thirdParty, params, callback){
    params = {
        openId: params.username,
        accessToken: params.password
    };
    getThirdPartyInfo(thirdParty, params, function(err, info){
        if(err){
            callback && callback(err);
            return;
        }

        if(info.ret !== 0){
            callback && callback(info.msg);
            return;
        }

        User.ifExist({
            thirdParty: thirdParty,
            thirdPartyId: params.openId
        }, function(err, user){
            if(err){
                callback && callback(err);
                return;
            }

            if(user){
                callback && callback(null, user);
            }else{
                user = User.create({
                    name: info.nickname,
                    password: Date.now().toString(),
                    thirdParty: thirdParty,
                    thirdPartyId: params.openId,
                    avatar: info.figureurl_qq_1
                });

                user.save(callback);
            }
        });
    });
};

exports.in = function(req, res){
    if(!(req.body.username && req.body.password)){
        res.send(500, {error: 'missing param.'});
        return;
    }

    var sendResponse = function(err, user){
        if(err){
            res.send(404, err);
            return;
        }
        req.session.uid = user.id;

        if(!req.get('isAjax')){
            res.redirect(req.body.target || '/');
            return;
        }

        user.password = null;
        res.json({
            err: null,
            data: user
        });
    };

    if(req.body.thirdParty){
        dealThirdParty(req.body.thirdParty, req.body, sendResponse);
        return;
    }

    var name = req.body.username,
        password = req.body.password;

    User.ifRight(name, password, sendResponse);
};

exports.out = function(req, res){
    req.session = null;

    res.json({
        err: null,
        data: {
            success: true
        }
    });
};