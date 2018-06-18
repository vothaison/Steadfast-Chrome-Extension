/**
    
*/
V.modules.create({
    name: 'atlassian.rapidboard',
    urlRegexes: [/https:\/\/steadfasttech\.atlassian\.net\/secure\/RapidBoard\.jspa.*/i],
    runNow: true,
    alwaysOn: true,
    context: {


    },

    execute: function () {
        console.info('Module "rapidboard" is running');
        //V.Extension.port.postMessage({
        //    request: "get-" + "extend-window",
        //});


    }
});


