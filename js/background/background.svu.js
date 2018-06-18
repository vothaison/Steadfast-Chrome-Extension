console.log("atlassian Extension is Running");
var ports = [];

chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== 'svu') return;
    console.log("svu port received")
    port.onDisconnect.addListener(function () {
        var index = ports.indexOf(port);
        if (index > -1) {
            ports.splice(index, 1);
        }
    });

    if (ports.indexOf(port) === -1 && port.name === "svu") {
        ports.push(port);

        if (ports.length === 1) {
            chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
                console.log('Page uses History API and we heard a pushSate/replaceState. ', details);

                ports.forEach(function (port) {
                    if (port.sender.tab.id === details.tabId) {
                        port.postMessage({
                            response: "svu-url-changed",
                            data: details
                        });
                        return false;
                    }
                });
            },
            {
                url: [{ hostContains: 'Forms/Main.ashx' }]
            });
        }

    }

    port.onMessage.addListener(function (msg) {

        console.log("Recieved message: ", msg);

        switch (msg.request) {
            case "get-something":
                break;

        }
    });
});


