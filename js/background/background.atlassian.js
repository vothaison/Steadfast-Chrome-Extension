console.log("atlassian Extension is Running");
var ports = [];

chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== 'atlassian') return;
    console.log("atlassian port recieved")
    port.onDisconnect.addListener(function () {
        var index = ports.indexOf(port);
        if (index > -1) {
            ports.splice(index, 1);
        }
    });

    if (ports.indexOf(port) === -1 && port.name === "atlassian") {
        ports.push(port);

        if (ports.length === 1) {
            chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
                console.log('Page uses History API and we heard a pushSate/replaceState. ', details);

                ports.forEach(function (port) {
                    if (port.sender.tab.id === details.tabId) {
                        port.postMessage({
                            response: "atlassian-url-changed",
                            data: details
                        });
                        return false;
                    }
                });
            },
            {
                url: [{ hostContains: 'atlassian.net' }]
            });
        }

    }

    port.onMessage.addListener(function (msg, port) {

        console.log("Recieved message: ", msg);

        switch (msg.request) {
            case "get-something":
                break;

            case "get-extend-window":
                console.log('extend-window');

                // Open tab in new window

                chrome.windows.create(
                    {
                        tabId: port.sender.tab.id,
                        width: 1920 + 2048,
                        height: 1920 - 30,
                        focused: true,
                        left: -1920,
                        top: 0
                    },
                    function callback(window) {
                        window.update({
                            width: 1920 + 2048
                        });
                    }
                );
        }

    });
});
