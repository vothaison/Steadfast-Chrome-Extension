
// Port under tracking
var ports = [];

chrome.runtime.onConnect.addListener(function (port) {
    console.log('background.bitbucket', 'FIRE chrome.runtime.onConnect', port);

    if (port.name !== 'bitbucket') return;

    console.log('background.bitbucket', "FIRE chrome.runtime.onConnect bitbucket port RECEIVED");

    if (ports.indexOf(port) === -1) {
        ports.push(port);
    }

    console.log('background.bitbucket', "FIRE chrome.runtime.onConnect ports", ports);

    port.onDisconnect.addListener(function (port) {
        console.log('background.bitbucket', 'FIRE  port.onDisconnect', arguments);
        var index = ports.indexOf(port);
        ports.splice(index, 1);
        console.log('background.bitbucket', 'FIRE  port.onDisconnect ports', ports);

    });

    port.onMessage.addListener(function (msg) {

        switch (msg.request) {
            //
            // Coordinate native messaging
            //
        case "post-native-client":
            console.log("port.onMessage", "post-native-client", msg);

            chrome.runtime.sendNativeMessage('com.example.native', {
                    ServiceName: msg.data.ServiceName,
                    Request: msg.data.Request
                },

                function (response) {
                    console.log("chrome.runtime.sendNativeMessag response-native-client", response);
                    port.postMessage({
                        response: "response-complete-native-client",
                        data: response ? JSON.parse(response.data) : '(NO NATIVE DATA)'
                    });
                });

            break;
        }
    });
});

console.log("bitbucket Extension is Running");
