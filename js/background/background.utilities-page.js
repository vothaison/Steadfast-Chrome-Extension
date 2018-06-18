(function () {
    var ports = [];

    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name !== 'utilities-page') return;

        console.log("utilities-page port received");

        port.onDisconnect.addListener(function () {
            var index = ports.indexOf(port);
            if (index > -1) {
                ports.splice(index, 1);
            }
        });

        if (ports.indexOf(port) === -1 && port.name === "utilities-page") {
            ports.push(port);
        }

        port.onMessage.addListener(function (msg) {
            switch (msg.request) {
                case "request-templates":

                    var templateNames = msg.templateNames;
                    var promises = [];

                    templateNames.forEach(function (templateName) {


                        var promise = new Promise(function (resolve, reject) {

                            var url = "/js/em/utilities/templates/" + templateName + ".hbs";

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
                                console.info("Template text FAILED", data);
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


