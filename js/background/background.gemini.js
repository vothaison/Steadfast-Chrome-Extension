/**
    This script will run once right after installing/reloading extension
*/

(function () {
    function reloadGeminiTabs() {
        chrome.tabs.query({ currentWindow: true }, function (arrayOfTabs) {

            arrayOfTabs.forEach(function (tab) {
                if (tab.url.indexOf(V.Const.GeminiUrl) > -1) {
                    try {
                        // Try window.location.reload() first, so that the page has a chance 
                        // to confirm reload, user might be in the middle of editing something
                        var code = 'window.location.reload();';
                        chrome.tabs.executeScript(tab.id, { code: code });
                    } catch (ex) {

                        chrome.tabs.reload(tab.id);
                        throw ex;
                    }
                }
            });
        });
    };

    chrome.storage.sync.get({
        options: {
            refreshGemeniPageUponReloadExtension: null,
        }
    }, function (items) {
        var options = items.options;
        if (options.refreshGemeniPageUponReloadExtension !== false) {
            reloadGeminiTabs();
        }
    });
}());

console.log("Copy Extension is Running");



var portNative = chrome.runtime.connectNative('com.example.native');

function contactNative() {
    var o = { title: "vo thai son", url: "hihi" };
    try {
        portNative.postMessage(o);
    }
    catch (err) {

        portNative = chrome.runtime.connectNative('com.example.native');
        portNative.postMessage(o);
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== 'COMMON') return;

    port.onMessage.addListener(function (msg) {

        switch (msg.request) {

            case "get-handshake":

                contactNative();

                chrome.runtime.sendNativeMessage('com.example.native',
                    {
                        text: "Hello " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        request: "gemini-extension-handshake"

                    },
                  function (response) {
                      port.postMessage({
                          response: "return-handshake",
                          nativeJson: JSON.parse(response.data),
                          nativeResponse: response
                      });

                  });




                break;
            case "get-can-switch-branch":

                (function () {

                    //console.log("get-can-switch-branch");
                    contactNative();

                    var branchName = msg.branchName;
                    var rq = {
                        text: "Hello " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        branchName: branchName,
                        request: "can-switch-branch"
                    };

                    //console.log("contact native", rq);

                    chrome.runtime.sendNativeMessage('com.example.native', rq,
                      function (response) {
                          //console.log("Received from native ", response);

                          port.postMessage({
                              response: "return-can-switch-branch",
                              data: {
                                  name: "vothaison",
                                  response: response
                              }
                          });

                      });

                }());

                break;

            case "get-perform-git-action":
                (function () {

                    //console.log("get-perform-git-action");
                    contactNative();
                    //console.log("contact native");
                    var branchName = msg.branchName;

                    chrome.runtime.sendNativeMessage('com.example.native',
                        {
                            text: "Hello " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                            branchName: branchName,
                            request: msg.gitRequest
                        },
                      function (response) {
                          //console.log("Received from native ", response);

                          port.postMessage({
                              response: "return-perform-git-action",
                              data: {
                                  name: "vothaison",
                                  response: response
                              }
                          });

                      });

                }());
                break;

            case "get-open-file-vs":
                (function () {

                    //console.log("get-open-file-vs");
                    contactNative();
                    //console.log("contact native");
                    var branchName = msg.branchName;

                    chrome.runtime.sendNativeMessage('com.example.native',
                        {
                            text: "Hello " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                            filePath: msg.filePath,
                            lineNumber: msg.lineNumber,
                            request: "open-boa-file"
                        },
                      function (response) {
                          //console.log("Received from native ", response);

                          port.postMessage({
                              response: "return-open-file-vs",
                              data: {
                                  name: "vothaison",
                                  response: response
                              }
                          });

                      });

                }());
                break;

        }
    });
});


(function () {
    var GIT_HUB = 'https://github.com';
    chrome.runtime.onConnect.addListener(function (port) {

        function getGitPulls(ticketNumber, callback) {
            // send two requests to get open and closed pr
            // poll the result;
            var openPr = [];
            var closedPr = [];

            var success = function (data) {
                var context = this;
                var gitPulls = context.pulls;

                var
                    openBody = data.match(/<body.*>/)[0],
                    s = data.substring(data.indexOf(openBody), data.indexOf("</body>") + 7);

                s = s.replace(openBody, '<div>').replace('</body>', '</div>');

                var doc = $(s);

                doc.find('.js-issue-row').each(function () {
                    var row = $(this),
                        link = row.find('a.js-navigation-open'),
                        url = link.attr('href'),
                        name = link.text().trim(),
                        geminiNumber = parseInt(name),
                        prNumber = url.split('/').pop(),

                        pull = {
                            url: GIT_HUB + url,
                            name: name,
                            geminiNumber: geminiNumber,
                            pullNumber: prNumber
                        };

                    gitPulls.push(pull);

                });
            };

            $.ajax({
                method: "GET",
                url: "https://github.com/SteadfastGroup/boa/pulls?q=is%3Apr+{0}+is%3Aopen".format(ticketNumber),
                data: {},
                context: { pulls: openPr }
            })
                .done(success);

            $.ajax({
                method: "GET",
                url: "https://github.com/SteadfastGroup/boa/pulls?q=is%3Apr+{0}+is%3Aclosed".format(ticketNumber),
                data: {},
                context: { pulls: closedPr }
            })
                .done(success);


            V.lib.poll(
                function () {
                    return openPr.length || closedPr.length;
                },
                function () {
                    callback({
                        openPr: openPr,
                        closedPr: closedPr
                    });
                },
                function () {
                    callback({
                        openPr: [],
                        closedPr: []
                    });
                }, 10000, 300);

        }

        port.onMessage.addListener(function (msg) {
            switch (msg.request) {

                case "request-github-pulls":
                    getGitPulls(msg.ticketNumber, function (gitPulls) {
                        console.log('gitPulls   ', gitPulls);
                        port.postMessage({
                            response: "response-github-pulls",
                            data: {
                                pulls: gitPulls
                            }
                        });
                    });

                    break;
                
                case "get-can-switch-branch":

                    (function () {

                        console.log("get-can-switch-branch");
                        contactNative();

                        var branchName = msg.branchName;
                        var rq = {
                            text: "Hello " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                            branchName: branchName,
                            request: "can-switch-branch"
                        };

                        console.log("contact native", rq);

                        chrome.runtime.sendNativeMessage('com.example.native', rq,
                          function (response) {
                              console.log("Received from native ", response);

                              port.postMessage({
                                  response: "return-can-switch-branch",
                                  data: {
                                      name: "vothaison",
                                      response: response
                                  }
                              });

                          });

                    }());

                    break;
            }
        });
    });

}());
