/**
    
*/
V.modules.create({
    name: 'explosm.all-page',

    urlRegexes: [
        /.+:\/\/explosm\.net*/i, // all boa page
    ],

    runNow: true,

    alwaysOn: true,

    context: {
        setupMessages: function() {

            V.Extension.boaPort.onMessage.addListener(function(msg) {
                if (msg.response === "response-" + "href") {
                    console.log('V.Extension.boaPort.onMessage response href', msg);
                }
            });
        },

        tellBackgroundHref: function() {
            return new Promise(resolve => {

                V.Extension.boaPort.postMessage({
                    request: "post-" + "href",
                    href: location.href,
                });

            });
        }
    },

    execute: function () {
        var _self = this;

        console.info('explosm.all-page is running');
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/lib/fontawesome/css/font-awesome.min.css", "css");


        //_self.tellBackgroundHref();
        

        
        //window.addEventListener('popstate', function(e) {
        //    console.log('url changed', e);
        //    _self.tellBackgroundHref();
        //});
    }
});


