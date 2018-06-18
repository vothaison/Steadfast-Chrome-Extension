/**
    This will observe url changed, and call appropriate handler
*/

; (function (window) {
    var currentUrl = window.location.href;

    V.Extension.port.onMessage.addListener(function (msg) {
        if (msg.response === "svu-url-changed") {
            var newUrl = msg.data.url;

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
        }
    });

}(window));