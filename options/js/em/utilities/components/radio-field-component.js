App.RadioFieldComponent = Ember.Component.extend({
    value: null,
    checked: Ember.computed('value', 'fieldValue', function () {
        return this.get('value') === this.get('fieldValue');
    }),

    classNameBindings: ['boaRadioInline:boa-radio--inline', 'boaRadioNoLabel:boa-radio--no-label'],

    boaRadioInline: Ember.computed('isInline', {
        get: function () {
            return this.get('isInline');
        }
    }),

    boaRadioNoLabel: Ember.computed('label', {
        get: function () {
            return !this.get('label');
        }
    }),

    isDisabled: Ember.computed('isReadOnly', 'isDisabledItem', function () {
        return this.get('isReadOnly') === true || this.get('isDisabledItem') === true;
    })
});

// /Ember/Common/components/radio-field-group.js
App.RadioFieldGroupComponent = App._baseFieldGroupComponent.extend({
    isInline: false,
    isNoLabel: false
});

App.RadioButtonComponent = Ember.Component.extend({
    tagName: 'input',
    type: 'radio',
    attributeBindings: ['type', 'htmlChecked:checked', 'value', 'name', 'disabled'],

    value: null,
    checked: null,

    htmlChecked: Ember.computed('value', 'checked', function () {
        return this.get('value') === this.get('checked');
    }),

    change: function () {
        this.set('checked', this.get('value'));
    },

    _setCheckedProp: function () {
        if (!this.$()) { return; }
        this.$().prop('checked', this.get('htmlChecked'));
    },

    _updateElementValue: Ember.observer('htmlChecked', function () {
        Ember.run.once(this, '_setCheckedProp');
    })
});
