App.BaseController = Ember.Controller.extend({
    
});

App.ApplicationController = Ember.Controller.extend({
    name: "application",

    handleInit: function () {

    }.on('init'),

    handleAfterInsert: function () {

    }.on('didInsertElement'),

    actions: {
        clicked: function () {
            console.log("Clicked.", this);
        }
    },

});