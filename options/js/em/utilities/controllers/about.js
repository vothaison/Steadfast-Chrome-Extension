App.AboutController = App.BaseController.extend({
    name: "about",

    handleInit: function () {
        console.log('about init')
    }.on('init'),

    getEditorContent: function () {
        return tinyMCE.activeEditor.getContent();
    },

    setEditorContent: function (content) {
        return tinyMCE.activeEditor.setContent(content);
    },

    // Saves options to chrome.storage
    saveContent: function (callback) {
        var aboutContent = this.getEditorContent();
        console.log('saveContent', aboutContent)
        chrome.storage.sync.set({
            aboutContent: aboutContent
        }, function () {
            callback && callback();
            Materialize.toast('Saved', 4000) // 4000 is the duration (ms) of the toast
        });
    },

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    restoreContent: function () {
        var that = this;
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            aboutContent: ''
        }, function (items) {
            var aboutContent = items.aboutContent;
            console.log('restoreOptions ', aboutContent)
            that.setEditorContent(aboutContent);
        });
    },

    afterRender: function () {
        this._super();
        var that = this;

        if (0) {
            tinymce.init({
                selector: 'textarea',
                height: 500,
                theme: 'modern',
                paste_data_images: !0,
                plugins: [
                  'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                  'searchreplace wordcount visualblocks visualchars code fullscreen',
                  'insertdatetime media nonbreaking save table contextmenu directionality',
                  'emoticons template paste textcolor colorpicker textpattern imagetools'
                ],
                toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                toolbar2: 'print preview media | forecolor backcolor emoticons',
                image_advtab: true,
                templates: [
                  { title: 'Test template 1', content: 'Test 1' },
                  { title: 'Test template 2', content: 'Test 2' }
                ],
                content_css: [
                  '/lib/tinymce/skins/lightgray/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
                  '/lib/tinymce/skins/lightgray/codepen.min.css',
                  '/css/options-tinymce.css'
                ]
            });



        } else {
            tinymce.init({
                selector: 'textarea',
                height: 10000,
                theme: 'modern',
                paste_data_images: !0,
                plugins: [
                  'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                  'searchreplace wordcount visualblocks visualchars code fullscreen',
                  'insertdatetime media nonbreaking save table contextmenu directionality',
                  'emoticons template paste textcolor colorpicker textpattern imagetools'
                ],
                toolbar: false,
                menubar: false,
                image_advtab: true,
                templates: [
                  { title: 'Test template 1', content: 'Test 1' },
                  { title: 'Test template 2', content: 'Test 2' }
                ],
                content_css: [
                  '/lib/tinymce/skins/lightgray/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
                  '/lib/tinymce/skins/lightgray/codepen.min.css',
                  '/css/options-tinymce.css'
                ]
            });
        }
        setTimeout(function () {
            that.restoreContent();
        }, 1000);

    },

    actions: {
        clicked: function () {
            console.log("Clicked.", this);
        },
        save: function () {
            console.log("Clicked save.", this);
            this.saveContent();
        }
    },

});