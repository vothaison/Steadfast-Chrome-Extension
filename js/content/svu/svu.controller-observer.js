/**
 * This will show a list of people who work on current project.
 * We can assign task by click on the person in this list
 * 
 * */

V.modules.create({
    name: 'controller-observer',
    optionName: 'controller-observer',
    urlRegexes: [V.SVU.UrlRegex.AllPages],
    runNow: true,
    alwaysOn: true,
    context: {
        

    },
    execute: function (options) {
        LOG("Execute controller-observer. options", options);

        if (!options.enableSneakyToolSVU) return;

        $('body').attr('data-sf_controller_name_lookup_function', options.controllerLookupFunctionSVU);
        V.lib.loadJsFile("chrome-extension://" + chrome.runtime.id + "/js/content/util/controller-observer.in-page.js", "js");
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/svu/svu.css", "css");


        
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                LOG('onMessage', request);

                if (request['devtools-status'] === "closed") {
                    LOG('CLOSE devtool');

                    V.lib.executeProxyFunction(function () {
                        $('.sf_controller_observer').css('bottom', '-1001px');
                    });

                } else if (request['devtools-status'] === "opened") {
                    LOG('OPEN devtool');
                    V.lib.executeProxyFunction(function () {
                        $('.sf_controller_observer').css('bottom', '0');
                    });
                }
            });

       
    }
});