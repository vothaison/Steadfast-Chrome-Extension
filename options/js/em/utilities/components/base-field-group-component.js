App._baseFieldGroupComponent = Ember.Component.extend({
    classNames: ['boa-field-group'],
    classNameBindings: ['isInline:boa-field-group--inline'],

    /**
        Controller containing the model def to which we wish to bind
    */
    modelDefController: null,

    /**
        Name of field in model def
    */
    fieldName: '',

    /**
       Field Label.  Overrides the default behaviour which is to bind to `modelDefController.nameLabel`
   */
    fieldLabel: null,

    /**
        Is this field read only or not?  Overrides the default behaviour which is to bind to `modelDefController.isViewMode`
    */
    isReadOnly: null,

    /**
        Validate the field on focus out
    */
    validateFieldOnFocusOut: true,

    /**
        Trim the field value on focus out
    */
    isTrimFieldValueOnFocusOut: false,

    /**
        Show the label and alert message inline with the input control
    */
    isInline: false,

    /**
        Highlighted the field
    */
    isHighlighted: false,

    /**
        Display the label or not
    */
    showLabel: true,

    /**
        Flag to indicate whether to use field error message or not
        @type Boolean
    */
    useFieldErrorMessage: true,

    defineProperties: function () {
        var rootBindPath = 'modelDefController.' + this.get('fieldName');
        var properties = ['Id', 'IsRequired', 'ErrorMessage'];

        properties.forEach(function (item, index) {
            //Ember.bind(this, 'field' + item, rootBindPath + item);

            Ember.defineProperty(this, 'field' + item, Ember.computed.alias(rootBindPath + item));

        }, this);

        if (Ember.isEmpty(this.get('fieldLabel'))) {
            Ember.defineProperty(this, 'fieldLabel', Ember.computed.alias(rootBindPath + 'Label'));

            //Ember.bind(this, 'fieldLabel', rootBindPath + 'Label');
        }

        if (Ember.isEmpty(this.get('isReadOnly'))) {
            //Ember.bind(this, 'fieldIsReadOnly', 'modelDefController.isViewMode');

            Ember.defineProperty(this, 'fieldIsReadOnly', Ember.computed.alias('modelDefController.isViewMode'));

        } else {
            //Ember.bind(this, 'fieldIsReadOnly', 'isReadOnly');
            Ember.defineProperty(this, 'fieldIsReadOnly', Ember.computed.alias('isReadOnly'));

        }

        if (!Ember.isEmpty(this.get('isHighlighted'))) {
            Ember.defineProperty(this, 'fieldIsHighlighted', Ember.computed.alias(rootBindPath + 'IsHighlighted'));

            //Ember.bind(this, 'fieldIsHighlighted', rootBindPath + 'IsHighlighted');
        }

        Ember.defineProperty(this, 'fieldValue', Ember.computed.alias(rootBindPath));

        //Ember.bind(this, 'fieldValue', rootBindPath);
    }.on('init'),


    /**
        Indicates if this field has an error
    */
    hasFieldErrorMessage: Ember.computed('fieldErrorMessage', {
        get: function () {
            return !Ember.isEmpty(this.get('fieldErrorMessage'));
        }
    }),


    /**
        The id for this field's error message span
    */
    fieldErrorId: Ember.computed('fieldId', {
        get: function () {
            return this.get('fieldId') + '_Error';
        }
    }),

    actions: {
        focusIn: function (event) {
            if (!Ember.isEmpty(this.get('focus-in'))) {
                //Ember.Logger.debug('focusIn' + event);
                this.sendAction('focus-in', event);
            }
        },
        focusOut: function (event) {
            if (this.get('isTrimFieldValueOnFocusOut')) {
                event = event.trim(); //The trim() method is not supported in Internet Explorer 8 and earlier versions.
                this.set('fieldValue', event);
            }
            if (this.get('validateFieldOnFocusOut') && !this.get('fieldIsReadOnly')) {
                var formController = this.get('modelDefController');
                formController.validateField(this.get('fieldName'), false);
            }

            if (!Ember.isEmpty(this.get('focus-out'))) {
                //Ember.Logger.debug('focusOut' + event);
                this.sendAction('focus-out', event);
            }
        },
        keyPress: function (event) {
            if (!Ember.isEmpty(this.get('key-press'))) {
                //Ember.Logger.debug('keyPress = ' + event.keyCode);
                this.sendAction('key-press', event);
            }
        },
        onChange: function (event) {
            if (!Ember.isEmpty(this.get('on-change'))) {
                this.sendAction('on-change', event);
            }
        },
    }
});