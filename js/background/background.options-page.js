(function () {
    var ports = [];

    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name !== 'options-page') return;

        console.log("options-page port received");

        port.onDisconnect.addListener(function () {
            var index = ports.indexOf(port);
            if (index > -1) {
                ports.splice(index, 1);
            }
        });

        if (ports.indexOf(port) === -1 && port.name === "options-page") {
            ports.push(port);
        }

        port.onMessage.addListener(function (msg) {
            switch (msg.request) {
                case "request-templates":

                    var templateNames = msg.templateNames;
                    var promises = [];

                    templateNames.forEach(function (templateName) {


                        var promise = new Promise(function (resolve, reject) {

                            var url = "/options/js/em/options/templates/" + templateName + ".hbs";

                            console.info("Template location: ", url);

                            $.ajax({
                                url: url,
                                headers: { 'Access-Control-Allow-Origin': '*' },
                                crossDomain: true
                            }).done(function (data) {
                                console.info("Template text loaded: ", data.substring(0, 50));
                                resolve({
                                    templateName: templateName,
                                    templateContent: data
                                });

                            }).fail(function (data) {
                                console.warn("Template text FAILED", data);
                                resolve({
                                    templateName: templateName,
                                    templateContent: ''
                                }); 
                            });

                        });

                        promises.push(promise);

                    });

                    Promise.all(promises).then(function (results) {
                        console.log('all templates', results);

                        port.postMessage({
                            response: "response-templates",
                            data: results
                        });
                    });

                    break;
            }
        });
    });
}());


console.log("utilities-page Extension is Running");


