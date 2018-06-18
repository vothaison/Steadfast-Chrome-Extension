App.BaseController = Ember.Controller.extend({
    defaultOf: function (type) {
        switch (type) {
            case 'string': return null;
            case 'number': return 0;
            case 'bool': return false;
        }
        return undefined;
    },

    emptyJSON: function () {
        var json = {},
            modelDef = this.get('modelDef'),
            that = this;

        modelDef.forEach(function (item, index) {
            if (item.defaultValue !== undefined) {
                json[item.name] = item.defaultValue;
            } else {
                json[item.name] = that.defaultOf(item.type);
            }
        });

        return json;
    },

    toJSON: function () {
        var json = {},
            modelDef = this.get('modelDef'),
            that = this;

        modelDef.forEach(function (item, index) {
            var value = that.get(item.name);
            if (value !== undefined) {
                json[item.name] = value;
            } else {
                json[item.name] = item.defaultValue;
            }

        });

        return json;
    },

    fromJSON: function (json) {
        var modelDef = this.get('modelDef'),
            _self = this;

        modelDef.forEach(function (item, index) {
            _self.set(item.name, json[item.name]);
        });
    },

    afterRender: function () {
        console.log('after render on base controller')
        var hash = location.hash;
        var selector = hash.substring(2);
        var firstSlash = selector.indexOf('/');
        if (firstSlash > -1) {
            selector = selector.substring(0, firstSlash);
        }

        selector = '.gtg-menu-item_' + selector.toLowerCase();
        $('.gtg-menu-item').removeClass('active');
        $(selector).addClass('active');
    }

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