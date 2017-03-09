if (!Array.prototype.find) {
    Array.prototype.find = function (callback) {
        var i,
            len;
        for (i = 0, len = this.length; i < len; i += 1) {
            if (callback(this[i], i, this)) { // callback(item, index, array)
                return this[i];
            }
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (callback) {
        var i,
            len;
        for (i = 0, len = this.length; i < len; i += 1) {
            if (callback(this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
}