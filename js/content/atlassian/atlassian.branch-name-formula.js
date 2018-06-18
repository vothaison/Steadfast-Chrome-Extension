V.formula = function (src) {
    var result = src.trim();
    
    result = result.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
        .replace(/[^\w\s]/gi, '_')
        .replace(/\s+/g, '_')
        .replace(/___/g, '__')
		.replace('_', '-');

    
    return result;
};