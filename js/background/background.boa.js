console.log("Steadfast BOA Extension is Running");

// Port under tracking
var ports = [];

chrome.runtime.onConnect.addListener(function (port) {
    console.log('background.boa', 'FIRE chrome.runtime.onConnect', port);

    if (port.name !== 'boa') return;

    console.log('background.boa', "FIRE chrome.runtime.onConnect boa port RECEIVED");

    if (ports.indexOf(port) === -1) {
        ports.push(port);
    }

    console.log('background.boa', "FIRE chrome.runtime.onConnect ports", ports);

    port.onDisconnect.addListener(function (port) {
        console.log('background.boa', 'FIRE  port.onDisconnect', arguments);
        var index = ports.indexOf(port);
        ports.splice(index, 1);
        console.log('background.boa', 'FIRE  port.onDisconnect ports', ports);

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

//// Handle popup port
//chrome.runtime.onConnect.addListener(function (port) {
//    console.log('background.boa', 'FIRE chrome.runtime.onConnect', port);

//    if (port.name !== 'popup') return;

//    console.log('background.boa', "FIRE chrome.runtime.onConnect popup port RECEIVED");

//    if (ports.indexOf(port) === -1) {
//        ports.push(port);
//    }

//    console.log('background.boa', "FIRE chrome.runtime.onConnect ports", ports);

//    port.onDisconnect.addListener(function (port) {
//        console.log('background.boa', 'FIRE  port.onDisconnect', arguments);
//        var index = ports.indexOf(port);
//        ports.splice(index, 1);
//        console.log('background.boa', 'FIRE  port.onDisconnect ports', ports);

//    });

//    port.onMessage.addListener(function (msg) {

//        switch (msg.request) {
         
//        case "post-execute-menu-command":
//            console.log("port.onMessage", "post-execute-menu-command", msg);

//            // Find the corresponding boa port
//            ports.forEach(p => {
//                if (p.sender.url.substr(0, p.sender.url.indexOf('#')) ===
//                    msg.data.url.substr(0, msg.data.url.indexOf('#'))) {
                    
//                    p.postMessage({
//                        response: "response-prepare-execute-menu-command",
//                        data: {
//                            url: msg.data.url
//                        }
//                    });
//                }
//            });

//            break;
//        }
//    });
//});


