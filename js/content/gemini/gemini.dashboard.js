

V.modules.create({
    name: 'dashboard',
    optionName: 'dashboard',
    urlRegexes: [V.Gemini.UrlRegexes.Dashboard],
    runNow: true,
    alwaysOn: true,

    context: {},
    execute: function (options) {
        console.log("Execute: dashboard");
        var tableScroll = $('#personal-dashboard #workload .table-scroll');
        var tableInner = $('#personal-dashboard #workload .table-scroll .jspContainer');
        var newHeight = tableScroll.height() + 50;

        tableScroll.height(newHeight);
        tableInner.height(newHeight);
    }
});

