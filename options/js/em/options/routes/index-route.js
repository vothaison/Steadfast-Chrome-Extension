App.IndexRoute = App.BaseRoute.extend({

    model: function (params, transition) {
        var _self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
            App.Utils.getTemplates(function() {
                _self.transitionTo('general');
                resolve();
            });
        });
    },

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('upstreamBranches', this.get('upstreamBranches'));
    }

});