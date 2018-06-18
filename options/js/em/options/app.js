
    window.App = Em.Application.create({
        VERSION: "0.0.1",
        rootElement: "#ember-root"
    });

    App.EqHelper = Ember.Helper.helper(function(values) {
        return values[0] == values[1];
    });
