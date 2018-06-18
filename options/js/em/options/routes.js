(function () { // Wrap in function to prevent accidental globals

    App.Router.map(function () {
        this.route('/', function () {
        });

        this.route('general', { path: '/general' });

        this.route('advanced', function () {
        });

        this.route('about', function () {
        });
    });

    App.BaseRoute = Ember.Route.extend({
        setupController: function (controller, model) {
            Ember.run.schedule("afterRender", this, function () {
                controller.afterRender();
            });
        }
    });

})();