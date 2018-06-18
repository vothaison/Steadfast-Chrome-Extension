

V.modules.create({
    name: 'changeMceEditor',
    optionName: 'changeMceEditor',
    urlRegexes: [V.Gemini.UrlRegexes.GeminiPage ],
    runNow: true,
    context: {


    },
    execute: function (option) {
        //console.log('Executing module: changeMceEditor');

        var body = $('body');

        //  Put button template text to body tag as a attribute so that injected script can access it.
        var templateText =
            + '<div role="group" id="mceu_34999" class="mce-container mce-last mce-flow-layout-item mce-btn-group" style="display: inline-block;float: right; margin-right: 5px; margin-top: 5px;">'
            + '    <div id="mceu_34-body" style="display: inline-block;float: right; margin-right: 5px; margin-top: 5px;">'
            + '      <div aria-label="Full screen" role="button" id="mceu_9999" class="mce-widget mce-btn mce-btn-small mce-first mce-last" tabindex="-1" aria- +labelledby="mceu_9999">'
            + '        <button type="button" tabindex="-1" title="Toggle fullscreen mode">'
            + '          <i class="mce-ico mce-i-fullscreen"></i>'
            + '        </button>'
            + '      </div>'
            + '    </div>'
            + '  </div>';
        body.attr('data-gx-template-text', templateText);
        body.attr('data-gx-editor-font-size', option.editorFontSize);

        // Inject some utilities into the page
        V.lib.executeProxyFunction(function () {

            window.V = window.V || {};
            V.lib = V.lib || {};

            V.lib.poll = function (fn, callback, errback, timeout, interval) {
                var endTime = Number(new Date()) + (timeout || 2000);
                interval = interval || 100;

                (function p() {
                    // If the condition is met, we're done! 
                    if (fn()) {
                        callback();
                    }
                        // If the condition isn't met but the timeout hasn't elapsed, go again
                    else if (Number(new Date()) < endTime) {
                        setTimeout(p, interval);
                    }
                        // Didn't match and too much time, reject!
                    else {
                        errback(new Error('timed out for ' + fn + ': ' + arguments));
                    }
                })();
            };

        });


        function clickOnAddHandler(e) {
            //console.log('click on buttonAdd', e);
            var currentTarget = $(e.currentTarget);
            // Add comment
            if (currentTarget.is('a.button.add')) {
                body.attr('data-gx-editor-id', "comments-wysiwyg-content");
            }
                // Add item
            else if (currentTarget.is('div#add-item.add-item, #add-description')) {

                V.lib.executeProxyFunction(function () {
                    // find current comment editor which is in fullscreen mode

                    var commentEditor = tinyMCE.editors.filter(function (e) { return e.TinyMCETFullscreen });
                    if (commentEditor.length) {
                        //debugger
                        // if it is fullscreen, then exit fullscreen
                        if (commentEditor[0].TinyMCETFullscreen) {
                            commentEditor[0].execCommand('mceFullScreen');
                            commentEditor[0].TinyMCETFullscreen = !commentEditor.TinyMCETFullscreen;
                        }

                    }

                });

                body.attr('data-gx-editor-id', "Description");
            } else if (currentTarget.is('.action-button-edit')) {

                $('.action-button-edit').attr('data-gx-just-clicked', '');
                currentTarget.attr('data-gx-just-clicked', 'clicked');

                setTimeout(function () {

                    V.lib.executeProxyFunction(function () {
                        var justClicked = $('.action-button-edit[data-gx-just-clicked="clicked"]');
                        if (justClicked) {
                            tinyMCE.editors.forEach(function (editor) {
                                if (editor.editorContainer === justClicked.closest('.comment-wrapper').find('.mce-tinymce.mce-container.mce-panel')[0]) {
                                    $('body').attr('data-gx-editor-id', editor.id);
                                }
                            });
                        }
                    });
                }, 500);

            }

            setTimeout(function () {
                /*
                    DANGER: THE FUNCTION PASSED IN executeProxyFunction DOES NOT HAVE CLOSURE
                */
                V.lib.executeProxyFunction(function () {
                    var body = $('body');
                    var getActiveEditor = function (id) {
                        return tinyMCE.editors[id];

                    };
                    var initFullscreenButton = function (editor) {

                        if (editor.id.indexOf("comments-wysiwyg-content") > -1) {
                            $(editor.editorContainer)
                                .closest('.comments-wysiwyg-container')
                                .css('width', '100%');

                            $(editor.editorContainer)
                                .css('width', '100%');
                        }

                        var isNewInstanceOfMCE = window.mceEditorInstances.indexOf(editor) === -1;

                        if (isNewInstanceOfMCE) {
                            var fontSize = body.attr('data-gx-editor-font-size') + 'px';
                            editor.getDoc().body.style.fontSize = fontSize;

                            if (editor) {
                                var container = $(editor.editorContainer);

                                container.find('.mce-edit-area iframe').contents().find('body')
                                    .css('background', 'aliceblue');
                                
                                var buttonFullScreen = $($('body').attr('data-gx-template-text'));
                                buttonFullScreen.click(function (e) {
                                    editor.TinyMCETFullscreen = !editor.TinyMCETFullscreen;
                                    editor.execCommand('mceFullScreen');

                                    if (editor.TinyMCETFullscreen) {
                                        container.find('.mce-edit-area iframe').css('height', '100%');
                                    } else {
                                        if (editor.id.indexOf("comments-wysiwyg-content") > -1) {
                                            $('html, body').animate({
                                                scrollTop: $(editor.editorContainer).closest('.comment-wrapper, #comments-content').offset().top
                                            }, 100);
                                        }
                                    }
                                });
                                buttonFullScreen.appendTo(container.find('.mce-container.mce-toolbar.mce-first.mce-stack-layout-item')[0]);
                            }

                            window.mceEditorInstances.push(editor);
                        }
                    };

                    window.mceEditorInstances = window.mceEditorInstances || [];
                    V.lib.poll(
                        function () {
                            var commentEditor = getActiveEditor(body.attr('data-gx-editor-id'));
                            //console.log('commentEditor polling ', body.attr('data-gx-editor-id'), commentEditor);
                            return commentEditor;
                        }, function () {
                            var commentEditor = getActiveEditor(body.attr('data-gx-editor-id'));
                            //console.log('commentEditor gotit ', commentEditor)
                            initFullscreenButton(commentEditor);

                        },
                        function () {


                        }, 20000, 300);
                });
            }, 500);

        }
        
        var selector = '';
        selector += V.Selector.ButtonAddComment;
        //selector += ',' + '.action-button-edit';
        selector += ',' + "#add-item";
        selector += ',' + '#add-description';

        $(selector).on('click', clickOnAddHandler);

        $("body").on("click", '.action-button-edit', clickOnAddHandler);
    }
});
