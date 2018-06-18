/**
    Define some global constants
*/
console.log('Steadfast Extension is running for BOA');
    
V.Extension.boaPort = chrome.runtime.connect({ name: "boa" });

V.BOA = V.BOA || {};

V.BOA.UrlRegex = {
    AllPages: /http:\/\/.+\/Boa\/.+/i,
}


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