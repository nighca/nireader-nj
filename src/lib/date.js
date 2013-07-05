var getDayObj = function(t){
    if(!t){
        t = new Date();
    }

    return {
        y: t.getFullYear(),
        m: t.getMonth() + 1,
        d: t.getDate(),
        value: t.valueOf()
    };
};

var dateFormat = function(y, m, d, sep){
    sep = sep || "";
    var f = "";
    if(y) f+=( y<10 ? "0"+y : "" + y )+sep;
    if(m) f+=( m<10 ? "0"+m : "" + m )+sep;
    if(d) f+=( d<10 ? "0"+d : "" + d );
    return f;
};

var getYear = function(t,sep){
    t = getDayObj(t);
    return dateFormat(t.y,null,null, sep);
};

var getMonth = function(t, sep){
    t = getDayObj(t);
    return dateFormat(t.y,t.m,null, sep);
};

var getDay = function(t, sep){
    t = getDayObj(t);
    return dateFormat(t.y,t.m,t.d, sep);
};

var timeFormat = function(t){
    return t && (t.toLocaleTimeString() + t.toLocaleDateString());
};

exports.getDayObj = getDayObj;
exports.dateFormat = dateFormat;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.format = timeFormat;