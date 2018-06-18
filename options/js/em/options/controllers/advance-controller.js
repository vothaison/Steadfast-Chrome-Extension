App.AdvancedController = App.BaseController.extend({
    name: "advanced",

    handleInit: function () {
        console.log("ADVANCED init")
    }.on('init'),

    handleAfterInsert: function () {
        console.log("ADVANCED handleAfterInsert")
    }.on('didInsertElement'),

    actions: {
        clicked: function () {
            console.log("Clicked.", this);
        }
    },
});
