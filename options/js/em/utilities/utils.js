(function () { // Wrap in function to prevent accidental globals

    window.App.Utils = {
        tempalteNames: [
            'application',
            'lorem-generator',
            'general',
            'about',
            'components/setting-item',
            'abc'
        ],

        templateLoaded: false,

        getTemplates: function (done) {

            if (this.templateLoaded) done();

            var _self = this;
            var port = chrome.runtime.connect({ name: "utilities-page" });
            port.postMessage({ request: "request-templates", templateNames: this.tempalteNames });
            port.onMessage.addListener(function (msg) {
                if (msg.response === "response-templates") {

                    console.log('receive templates', msg);
                    msg.data.forEach(function (template) {
                        Ember.TEMPLATES[template.templateName] = Ember.Handlebars.compile(template.templateContent);
                    });
                    _self.templateLoaded = true;
                    done();
                }
            });

        }
    }
})();