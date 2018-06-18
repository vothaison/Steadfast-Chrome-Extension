/**
    
*/
V.modules.create({
    name: 'boa.home-page',

    urlRegexes: [
        /.+:\/\/localhost\/Boa./i, // all boa page
    ],

    runNow: true,

    alwaysOn: true,

    context: {
        setupMessages: function() {

            V.Extension.boaPort.onMessage.addListener(function (msg) {
                switch (msg.response) {
                    case "response-href":
                        console.log('V.Extension.boaPort.onMessage response href', msg);
                        break;

                    case "response-logo-click":
                        console.log('V.Extension.boaPort.onMessage response logo-click', msg);
                        break;
                }
            });
        },

        sendClickToBackground: function() {
            return new Promise(resolve => {

                V.Extension.boaPort.postMessage({
                    request: "post-" + "logo-click",
                    data: {},
                });

            });
        },
    },

    execute: function () {
        var _self = this;

        console.info('boa.home-page is running');

        this.setupMessages();

        $('.boa-p-home-logo').click(function() {
            _self.sendClickToBackground();
        });
    }
});


