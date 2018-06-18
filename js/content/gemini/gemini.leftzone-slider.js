

V.modules.create({
    name: 'makeLeftZoneSlider',
    optionName: 'makeLeftZoneSlider',
    urlRegexes: [V.Gemini.UrlRegexes.ItemDetailsPage],
    runNow: true,
    context: {},

    //cssFiles: ["/css/content/gemini/gemini.leftzone-slider.css"],

    execute: function (options) {
        console.log("Executing: ", 'makeLeftZoneSlider ', options);
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/gemini/gemini.leftzone-slider.css", "css");
        $('#view-item-content-pane').detach().appendTo('.right-zone');
    }
});

