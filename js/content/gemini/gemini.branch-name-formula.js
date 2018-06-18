if (V.formula) throw "Cannot override property 'formula' of V";

V.formula = function (src) {
    var result = src.trim();

    var i = 0;
    while (i++ < result.length) {
        if (result[i] === '-') {
            result = result.substring(i + 1);
            break;
        }
    }

    result = result.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
        .replace(/[^\w\s]/gi, '_')
        .replace(/\s+/g, '_')
        .replace(/___/g, '__');

    
    return result;
};