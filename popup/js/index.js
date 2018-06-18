//var boaPort = chrome.runtime.connect({ name: "popup" });

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {

        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url, tab);
    });
}


getCurrentTabUrl(function (url, tab) {

    (function () { }());


    (function () {
        var buttonSetDueDate = $('#button-set-due-date'),
            buttonSave = $('#button-save-data'),
            buttonShow = $('#button-show-data'),
            buttonAbout = $('#button-about'),
            buttonOpenOptions = $('#button-open-options-page'),
           // buttonLocateSourceFile = $('#button-locate-source-file'),
            buttonOpenUtilities = $('#button-open-utilities-page');

        //var isBOA = (/.+:\/\/localhost\/Boa\/*/i).test(url)

        //if (isBOA) {
        //    buttonLocateSourceFile.click(function() {

        //        boaPort.postMessage({
        //            request: "post-" + "execute-menu-command",
        //            data: {
        //                command: 'locate-source-file',
        //                url: url
        //            }
        //        });

        //        boaPort.onMessage.addListener(function(msg) {
        //            if (msg.response === "response-" + "native-client") {
        //                console.log('V.Extension.boaPort.onMessage response href', msg);
        //            }
        //        });
        //    });
        //} else {
        //    buttonLocateSourceFile.hide();
        //}
        


        function addEventForButtons() {
            buttonSetDueDate.click(function (e) {
                chrome.tabs.query({ active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,
                            { command: "set-due-date" },
                            function (response) {
                            });
                    });
            });

            buttonSave.click(function () {
                saveValue({ 'setSprint': true })
            });

            buttonShow.click(function () {
                getValue(function (value) {
                    alert(value)
                });
            });
        }

        function setDisabledForButtons() {
            buttonSetDueDate.addClass('disabled')
                .attr('title', 'This command is only available for Gemini website');
        }

        if (url.search(/gemini.*\/workspace\/\d+\/items/ig) !== -1) {
            addEventForButtons();
        } else {
            setDisabledForButtons();
        }

        buttonOpenUtilities.click(function () {
            window.open('chrome-extension://' + chrome.runtime.id + '/html/utilities.html', '_blank');
        });

        buttonOpenOptions.click(function () {
            window.open('chrome-extension://' + chrome.runtime.id + '/options/index.html', '_blank');
        });

        buttonAbout.click(function () {
            alert('This is the best Extension in the world (isn\'t it');
        });


    }());
});

function getValue(callback) {
    chrome.storage.sync.get(/* String or Array */["value"], function (item) {
        //  items = [ { "yourBody": "myBody" } ]
        callback(item['value'].setSprint);
    });
}

function saveValue(value) {
    // Get a value saved in a form.
    // Check that there's some code there.
    if (!value) {
        alert('Error: No value specified');
        return;
    }
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({ 'value': value }, function () {
        // Notify that we saved.
        alert('Settings saved');
    });
}


function httpGet(theUrl, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", theUrl, true);
    xmlhttp.send();
}
