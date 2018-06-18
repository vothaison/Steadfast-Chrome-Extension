App.LoremGeneratorRoute = App.BaseRoute.extend({

    model: function (params, transition) {
        var _self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
            App.Utils.getTemplates(function() {
                resolve();
            });
        });
    },

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('upstreamBranches', this.get('upstreamBranches'));
    }

});