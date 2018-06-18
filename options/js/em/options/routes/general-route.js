App.GeneralRoute = App.BaseRoute.extend({

    renderTemplate: function () {
        this.render('general', { outlet: 'main' });
    },

    model: function (params, transition) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            App.Utils.getTemplates(function () {
                resolve();
            });
        });
    },

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('upstreamBranches', this.get('upstreamBranches'));
    }
});