
String.prototype.allTrim = String.prototype.allTrim ||
    function () {
        return this.replace(/\s+/g, ' ')
                   .replace(/^\s+|\s+$/, '');
    };

Array.prototype.distinct = Array.prototype.distinct || function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

Array.prototype.remove = function (elem, all) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === elem) {
            this.splice(i, 1);
            if (!all)
                break;
        }
    }
    return this;
};

// First, check if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}
