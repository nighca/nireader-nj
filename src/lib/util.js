var format = function (num, hex, units, dec) {
    num = num || 0;
    dec = dec || 0;
    var level = 0;
    while(num >= hex){
        num /= hex;
        level++;
    }

    if(level==0) dec = 0;

    return {
        "base" : num.toFixed(dec),
        "unit" : units[level],
        "format" : function(sep){
            sep = sep || "";
            return this.base + sep + this.unit;
        }
    };
};

exports.format = format;