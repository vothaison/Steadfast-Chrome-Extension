App.LoremGeneratorController = App.BaseController.extend({

    name: "lorem-generator",
    
    characterCount: 10,

    generatedText: '',

    executeCopyAction: function () {
        var _self = this;

        Ember.run.later(function () {
            $('[data-button="button-copy"]').click();
            _self.selectText('generatedText');
        });
    },

    initCopyButton: function() {
        var clipboard = new Clipboard('[data-button="button-copy"]');

        clipboard.on('success', function (e) {
            $('[data-badge="badge"]').fadeIn();

            setTimeout(function() {
                $('[data-badge="badge"]').fadeOut();
            }, 500);
        });
    },

    initSlider: function () {
        var _self = this;

        $('#slider-input').slider();
        $('#slider-input').on("change", function (slideEvt) {
            var count = slideEvt.value.newValue;
            var text = _self.makeLoremText(count);
            
            _self.set('characterCount', count);
            _self.set('generatedText', text);
            _self.executeCopyAction();
        });
    },

    makeLoremText: function (count) {
        var text = new Lorem().createText(200, Lorem.TYPE.WORD);
        text = text.substring(0, count);

        if (text[count - 1] === ' ') {
            text = text.substring(0, count - 1) + 'j';
        }
        return text;
    },

    selectText: function (containerid) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    },

    afterRender: function () {
        this.initCopyButton();
        this.initSlider();
        // Generate upon init
        this.send('regenerateText');
    },

    actions: {
        close: function () {
            window.close();
        },

        copyGeneratedText: function() {
            
        },

        regenerateText: function () {
            var characterCount = this.get('characterCount');
            var textToCopy = this.makeLoremText(characterCount);
            console.log('copied', textToCopy);
            this.set('generatedText', textToCopy);
            this.executeCopyAction();
        }
    },


});
