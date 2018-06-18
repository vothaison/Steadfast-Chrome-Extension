; (function (window) {
    V.Extension = V.Extension || {};

    V.Extension.bitbucketPort = chrome.runtime.connect({ name: "bitbucket" });

    V.Bitbucket = V.Bitbucket || {};

    V.Bitbucket.Regexes = {

    }

}(window));


console.info("bitbucket Extension is Running");


V.lib.executeModules = function executeModules(newUrl) {
    for (var moduleName in V.Modules) {
        if (V.Modules.hasOwnProperty(moduleName)) {
            var module = V.Modules[moduleName];
            var canRunAgainstUrl = module.canRunAgainstUrl(newUrl);
            if (canRunAgainstUrl) {
                console.log("Execute module: ", moduleName);
                module.execute();
            }
        }
    }
}

V.lib.addEventListener = function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function () {
            handler.call(el);
        });
    }
}

V.lib.addStylesheetRules = function addStylesheetRules(rules) {
    var styleEl = document.createElement('style'),
        styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    styleSheet = styleEl.sheet;

    for (var i = 0, rl = rules.length; i < rl; i++) {
        var j = 1, rule = rules[i], selector = rules[i][0], propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
            rule = rule[1];
            j = 0;
        }

        for (var pl = rule.length; j < pl; j++) {
            var prop = rule[j];
            propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}
