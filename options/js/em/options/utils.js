
App.Utils = {
    tempalteNames: [
        'application',
        'general',
        'advanced',
        'about',
        'components/setting-item',
        'components/radio-field',
        'components/radio-field-group',
        'components/bootstrap-dropdown-list'
    ],

    templateLoaded: false,

    getTemplates: function (done) {

        if (this.templateLoaded) done();

        var _self = this;
        var port = chrome.runtime.connect({ name: "options-page" });
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
