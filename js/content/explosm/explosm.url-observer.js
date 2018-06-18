/**
    This will observe url changed, and call appropriate handler
*/


var currentUrl = window.location.href;

window.addEventListener('popstate', function (e) {

    var newUrl = location.href;

    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        console.log('URL changed to', newUrl);

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

});