var config = require("../config/compare.json");

var longSize = config.longSize,
    partLength = config.partLength,
    judges = config.judges;

var getLevenshteinDistance = function(cnt1, cnt2){
    if(cnt1 === cnt2){
        return 0;
    }

    var t = Date.now();
    var l1 = cnt1.length,
        l2 = cnt2.length,
        cache = [];

    for(var r = 0; r < l1; r++){
        cache[r] = [];
    }

    for(var i = 0; i < l1; i++){
        for(var j = 0; j < l2; j++){
            if(i === 0){
                cache[i][j] = j;
            }else if(j === 0){
                cache[i][j] = i;
            }else{
                cache[i][j] = Math.min(
                    cache[i-1][j] + 1,
                    cache[i][j-1] + 1,
                    cache[i-1][j-1] + (cnt1[i] === cnt2[j] ? 0 : 1)
                );
            }
        }
    }

    return cache[--l1][--l2];
};

var getRelative = function(cnt1, cnt2){
    var l1 = cnt1.length,
        l2 = cnt2.length;

    if(!l1 || !l2){
        return 0;
    }

    var l = Math.max(l1, l2),
        dist = getLevenshteinDistance(cnt1, cnt2),
        relative = (l - dist) / l;

    return relative;
};

var getRelativeForLongCnt = function(cnt1, cnt2, maxPartLength){
    var l1 = cnt1.length,
        l2 = cnt2.length,
        l, s;

    if(l1 >= l2){
        l = l1;
        s = l2;
    }else{
        l = l2;
        s = l1;
    }

    var partsNum = Math.ceil(l / (maxPartLength || partLength)),
        pl1 = l1/partsNum,
        pl2 = l2/partsNum,
        pl = l/partsNum,
        ps = s/partsNum,
        result1 = 0,
        result2 = 0,
        result3 = 0;

    for(var i = 0; i < partsNum; i++){
        result1 += getRelative(
            cnt1.slice(pl1 * i, pl1 * i + ps),
            cnt2.slice(pl2 * i, pl2 * i + ps)
        );
        result2 += getRelative(
            cnt1.slice(l1 - pl * (i+1), l1 - pl * i),
            cnt2.slice(l2 - pl * (i+1), l2 - pl * i)
        );
        result3 += getRelative(
            cnt1.slice(pl * i, pl * i + pl),
            cnt2.slice(pl * i, pl * i + pl)
        );
    }

    result1 /= partsNum;
    result2 /= partsNum;
    result3 /= partsNum;

    return Math.max(result1, result2, result3);
};

var removeHtmlTag = function(cnt){
    return cnt.replace(/(\<[^\<]*\>)|(\<\/[^\<]*\>)|(\s)/g, '');
};

var getRelForArticle = function(cnt1, cnt2){
    cnt1 = removeHtmlTag(cnt1);
    cnt2 = removeHtmlTag(cnt2);

    var l1 = cnt1.length,
        l2 = cnt2.length;

    var result = ((l1 >= l2 ? l1 : l2) > longSize ? getRelativeForLongCnt : getRelative)(cnt1, cnt2);

    return result;
};

var isSameArticle = function(art1, art2){
    return getRelForArticle(art1, art2) >= judges.article;
};

module.exports = {
    isSameArticle: isSameArticle
};