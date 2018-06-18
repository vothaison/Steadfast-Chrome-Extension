

V.modules.create({
    name: 'changeGeminiAppearance',
    optionName: 'changeGeminiAppearance',
    urlRegexes: [V.Gemini.UrlRegexes.GeminiPage],
    runNow: true,
    context: {

        addAvatarGemini: function () {
            var githubPeople = V.Extension.People;

            var authorBoxes = V.$(V.Selector.AuthorBox);
            authorBoxes.each(function () {
                var authorBox = $(this),
                    arrow = authorBox.find('.expander'),
                    authorName = authorBox.find('.author').text().trim();
                var people = githubPeople.filter(function (item) {
                    if (item.geminiName && authorName) {
                        return item.geminiName.allTrim() === authorName.allTrim();
                    }
                }).pop();
            });
        }
    },
    execute: function (option) {
        console.log('Executing module: geminiAppearance');

        V.lib.poll(
           function () {
               return $('body').length;
           },
           function () {

               $('body').addClass('geminiEX');

               $(function () {
                   V.sheet.injectCssRule("body.geminiEX {font-size: {0}px !important;}".format(option.editorFontSize));

                   //V.sheet.injectCssRule('body.geminiEX', { 'font-size': option.editorFontSize + 'px !important;' });

                   V.sheet.injectCssRule("#view-item .comments table td+td+td {font-size: {0}px !important;}".format(option.editorFontSize));
                   V.sheet.injectCssRule("#tinymce {font-size: {0}px !important;}".format(option.editorFontSize));
                   V.sheet.injectCssRule(".geminiEX #view-item .description  {font-size: {0}px !important;}".format(option.editorFontSize));
                   V.sheet.injectCssRule(".geminiEX #view-item .contents-pane .tab-content  {font-size: {0}px !important;}".format(option.editorFontSize));
                   V.sheet.injectCssRule("#view-item .attributes-pane .attribute-value span {font-size: {0}px !important;}".format(option.editorFontSize - 1));

                   $('body .cs-wysiwyg span').css('font-size', '{0}px'.format(option.editorFontSize));

                   setTimeout(function () {
                       $('body').css('opacity', 1);
                   }, 200);
               })

           },
           function () {
               console.warn("Poll failed for ", 'ge appearance');
           }
       );





    }
});
