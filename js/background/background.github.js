(function () {
    var ports = [];

    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name !== 'COMMON') return;

        port.onDisconnect.addListener(function () {
            var index = ports.indexOf(port);
            if (index > -1) {
                ports.splice(index, 1);
            }
        });

        if (ports.indexOf(port) === -1 && port.name === "COMMON") {
            ports.push(port);

            if (ports.length === 1) {
                chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
                    console.log('Page uses History API and we heard a pushSate/replaceState. ', details);
                     
                    ports.forEach(function (port) {
                        if (port.sender.tab.id === details.tabId) {
                            port.postMessage({
                                response: "github-url-changed",
                                data: details
                            });
                            return false;
                        }
                    });
                },
                {
                    url: [{ hostContains: 'github.com' }]
                });
            }

        }
    });
}());


chrome.runtime.onConnect.addListener(function (port) {
    console.log('chrome.runtime.onConnect.addListener ');
    console.log(port);

    function getGitUpstreamBranches(ticketNumber, callback) {
        // send two requests to get open and closed pr
        // poll the result;
        var branches = [];

        var success = function (data) {
             
            var context = this;
            var branches = context.branches;
            
            console.log('getGitUpstreamBranches data', data)

            $(data).find('.js-select-menu-tab-bucket[role="menu"] .select-menu-item span')
                .each(function(_, item) {
                    branches.push(item.innerHTML.trim());
                });
        };

        var fail = function (data) {
            branches = ['master'];
        };

        $.ajax({
            method: "GET",
            url: "https://github.com/SteadfastGroup/boa",
            data: {},
            context: { branches: branches },
            timeout: 3000
        })
        .done(success)
        .fail(fail);
        

        V.lib.poll(
            function () {
                return branches.length;
            },
            function () {
                callback({
                    branches: branches,
                });
            },
            function () {
                callback({
                    branches: branches,
                });
            }, 10000, 300);

    }


    if (port.name !== 'COMMON') return;

    port.onMessage.addListener(function (msg) {
        switch (msg.request) {

            case "get-all-open-tab-urls":
                var urls = [];
                chrome.windows.getAll({ populate: true }, function (windows) {
                    windows.forEach(function (window) {
                        window.tabs.forEach(function (tab) {
                            //collect all of the urls here, 
                            urls.push({
                                url: tab.url,
                                tab: tab,
                                id: tab.id
                            });
                        });

                        port.postMessage({
                            response: "return-all-open-tab-urls",
                            data: {
                                urls: urls
                            }
                        });
                    });
                });
                break;

            case "close-this-tab":
                chrome.tabs.remove(msg.id, function callback() {
                    console.log('closed tab');
                });

                break;

            case "reload-this-tab":
                chrome.tabs.reload(msg.id, function callback() {
                    console.log('closed tab');
                });

                break;

            case "reload-and-focus-this-tab":
                chrome.tabs.reload(msg.id, function callback() {
                    chrome.tabs.update(msg.id, { selected: true });
                });

                break;

            case "open-this-url-in-new-tab":
                chrome.tabs.create({ url: msg.url });
                break;

            case "get-button-toggle-plus-minus-signs":

                chrome.storage.sync.get({
                    options: {
                        buttonGoToGemini: true
                    }
                }, function (items) {
                    var options = items.options;

                    port.postMessage({
                        response: "return-button-toggle-plus-minus-signs",
                        data: {
                            allow: options.buttonTogglePlusMinus,
                        }
                    });

                });

                break;

            case "request-github-upstream-branches":
                console.log(' Background  request-github-upstream-branches');
                getGitUpstreamBranches(msg.ticketNumber, function (branches) {
                    console.log(' Background  response-github-upstream-branches', branches);
                    port.postMessage({
                        response: "response-github-upstream-branches",
                        data: branches
                    });
                });

                break;
        }
    });
});
;