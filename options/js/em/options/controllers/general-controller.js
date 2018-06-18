App.GeneralController = App.BaseController.extend({
    name: "general",

    modelDef: [
        { name: 'editorFontSize', type: 'number', defaultValue: 16 },

        { name: 'geminiLogin', type: 'string' },
        { name: 'geminiToken', type: 'string' },

        { name: 'showQuickAssign', type: 'bool', defaultValue: false },
        { name: 'showGithubPRStatus', type: 'bool', defaultValue: false },
        { name: 'changeGeminiAppearance', type: 'bool', defaultValue: true },

        { name: 'copyTextFromTitle', type: 'bool', defaultValue: true },
        { name: 'copyGitBranchName', type: 'bool', defaultValue: true },
        { name: 'copyTitleAndUrl', type: 'bool', defaultValue: true },
        { name: 'copyEvernoteString', type: 'bool', defaultValue: false },

        { name: 'refreshGemeniPageUponReloadExtension', type: 'bool', defaultValue: false },
        { name: 'showGitFastToolbar', type: 'bool', defaultValue: false },

        { name: 'boaSolutionFolder', type: 'string', defaultValue: "c:\\dev\\boa" },
        { name: 'changeMceEditor', type: 'bool', defaultValue: true },

        { name: 'makeLeftZoneSlider', type: 'bool', defaultValue: true },
        { name: 'enableSneakyToolSVU', type: 'bool', defaultValue: true },
        { name: 'enableSneakyToolBOA', type: 'bool', defaultValue: true },


        //
        // Atlasian
        //
        { name: 'atlCopyGitName', type: 'bool', defaultValue: true },

        //
        // BitBucket
        //
        { name: 'bitLocateFiles', type: 'bool', defaultValue: true },
        { name: 'bitShowGitLog', type: 'bool', defaultValue: true },

        //
        // BOA
        //
        { name: 'boaActionButtons', type: 'bool', defaultValue: true },
    ],

    comboData: {
        FontSize: [
            { value: 11, label: 11 },
            { value: 12, label: 12 },
            { value: 13, label: 13 },
            { value: 14, label: 14 },
            { value: 15, label: 15 },
            { value: 16, label: 16 },
        ]
    },

    fontSize: 12,

    fontSizeChanged: Ember.observer('fontSize', function () {
        console.log('font size changed');
    }),

    changeMceEditorChanged: Ember.observer('changeMceEditor', function () {
        var changeMceEditor = this.get('changeMceEditor');
        this.set('editorFontSizeDisabled', !changeMceEditor);
        console.log('changeMceEditor', changeMceEditor);
    }),
    
    afterRender: function () {
        this._super();
        $('.gx-single-option-title a').click(false);
        //$('.gx-single-option-title a').not('[no-tooltip]').kendoTooltip({
        //    content: kendo.template($("#template-tooltip").html()),
        //    _width: 600,
        //    height: "100%",
        //    position: "right",
        //});
    },

    // Saves options to chrome.storage
    saveOptions: function (callback) {
        var options = this.toJSON();
        LOG('options to save', options);
        chrome.storage.sync.set({
            options: options
        }, function () {
            callback && callback();
        });
    },

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    restoreOptions: function (callback, context) {
        var _self = this;
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            options: this.emptyJSON()
        }, function (items) {
            var options = items.options;
            console.log('restoreOptions ', options);
            _self.fromJSON(options);
            callback.call(context);
        });

    },
    
    init: function () {
        var _self = this;

        this._super();

        this.restoreOptions(function () {
            _self.setupAutoSave();
            _self.saveOptions();
        });

        var all = this.get('modelDef').filter(function(field) {
            return field.type === 'bool';
        }).map(function(field) {
            return field.name;
        });

        
        var computed = all.slice();
        var setInProgress = false;
        var lastValue = false;

        computed.push({
            get: function (key) {
                if (setInProgress) {
                    return lastValue;
                };

                var allTrue = true;
                for (var i = 0; i < all.length; i++) {
                    var prop = all[i];
                    if (!this.get(prop)) {
                        allTrue = false;
                        break;
                    }
                };
                lastValue = allTrue;
                return allTrue;
            },

            set: function (key, value) {
                for (var i = 0; i < all.length; i++) {
                    var prop = all[i];
                    this.set(prop, value);
                }
                return value;
            }
        });
        
        Ember.defineProperty(this, 'enableAll', Ember.computed.apply(this, computed));
    },

    setupAutoSave: function () {
        var self = this,
            modelDef = this.get('modelDef');

        var propertyNames = modelDef.map(function (field) {
            return field.name;
        });

        propertyNames.forEach(function (name) {
            self.addObserver(name, function () {
                self.saveOptions();
            });
        });
    },

    actions: {
        save: function () {
            this.saveOptions();
        },

        reset: function () {
            this.restoreOptions();
        },

        close: function () {
            window.close();
        },

        gotoSelf: function (number) {
            console.log('gotoSelf ', number);
            this.transitionToRoute('general', { queryParams: { category: number } })
        }
    },
});
