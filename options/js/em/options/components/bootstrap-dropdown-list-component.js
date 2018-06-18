App.BootstrapDropdownListComponent = Ember.Component.extend({
    name: "BootstrapDropdownListComponent",
    tagName: 'select',
    classNameBindings: ['form-control'],
    sizeMin: 10,
    sizeMax: 17,
    sizes: Em.computed('sizeMin', 'sizeMax', function() {
        var sizeMin = this.get('sizeMin');
        var sizeMax = this.get('sizeMax');
        var sizes = [];

        for (var i = sizeMin; i < sizeMax; i++) sizes.push(i);
        sizes.push(sizeMax);
        return sizes;
    }),

    init: function () {
        this._super();

    },

    didInsertElement: function () {
        var _self = this;
            console.log('init value ', this.get('fieldValue'))

        Ember.run.schedule('afterRender', this, function () {
            console.log('init value ', this.get('fieldValue'))
            //this.$().val(parseInt(this.get('fieldValue')) || 15);
        });

        this.$().change(function() {
            var value = $(this).val();
            _self.set('fieldValue', parseInt(value));
        });
    },

    disabled: false,

    actions: {
        buttonClick: function() {
            console.log("Clicked.", this);
        }
    },
    
});

