App.GeneralController = App.BaseController.extend({
    name: "general",
    
    afterRender: function () {
        this._super();
        //console.log("after render", $('.gx-single-option-title a').length);
        $('.gx-single-option-title a').click(false);
    },

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    restoreOptions: function (callback, context) {
        var that = this;
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            options: this.emptyJSON()
        }, function (items) {
            var options = items.options;
            console.log('restoreOptions ', options);
            that.fromJSON(options);
            callback.call(context);
        });
    },

    queryParams: ['category'],

    category: null,

    init: function () {
        this._super();
    },

    setupAutoSave: function () {
        var self = this,
            modelDef = this.get('modelDef');

        var propertyNames = modelDef.map(function(field) {
            return field.name;
        });

        propertyNames.forEach(function(name) {
            self.addObserver(name, function() {
                self.saveOptions();
            });
        });

        
    },

    enableAllChanged: Ember.observer('enableAll', function() {
        var enableAll = this.get('enableAll');

        var self = this,
            modelDef = this.get('modelDef');

        var propertyNames = modelDef.map(function (field) {
            return field.name;
        });

        propertyNames.forEach(function (name) {
            self.set(name, enableAll);
        });
    }),

    actions: {
        close: function () {
            window.close();
        }
    },


});
