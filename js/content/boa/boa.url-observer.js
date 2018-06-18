/**
    This will observe url changed, and call appropriate handler
*/


var currentUrl = window.location.href;

//function executeModules(newUrl) {
//    for (var moduleName in V.Modules) {
//        if (V.Modules.hasOwnProperty(moduleName)) {
//            var module = V.Modules[moduleName];
//            var canRunAgainstUrl = module.canRunAgainstUrl(newUrl);
//            if (canRunAgainstUrl) {
//                console.log("Execute module: ", moduleName);
//                module.execute();
//            }
//        }
//    }
//}

// Execute modules on start up
V.lib.executeModules(currentUrl);

// Execute modules everytime url change
window.addEventListener('popstate', function (e) {
    var newUrl = location.href;

    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        console.log('URL changed to', newUrl);
        V.lib.executeModules(newUrl);
    }
});


