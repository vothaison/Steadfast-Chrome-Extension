

V.modules.create({

    name: 'copyTextFromTitle',

    optionName: 'copyTextFromTitle',

    urlRegexes: [V.Gemini.UrlRegexes.ItemDetailsPage],

    runNow: true,

    context: {},

    execute: function (options) {
        LOG("Gemini Extension. Module ", 'copyTextFromTitle ', options);

        var title = $(V.Selector.ItemTitle),
                geminiNumber = parseInt(location.href.split('/').pop()),
                projectInfo = $(V.Selector.ProjectInfo),
                triggerShow = $(V.Selector.ProjectInfo + ', ' + V.Selector.ItemTitle);

        projectInfo.addClass('gx-project-info');

        if (title.length) {
            var geButtonHtml = '<a href="javascript:void(0)" class="gx-btn">{0}</a>',


                geToolbar = $('<div class="gx-toolbar">'),
                buttonCopyGitBranchName = $(geButtonHtml.format(V.Const.COPY_GIT_BRANCH_NAME)),
                copyTitleAndUrl = $(geButtonHtml.format(V.Const.COPY_TITLE)),
                buttonCopyEvernote = $(geButtonHtml.format('Copy Title for Evernote')),
                tooltipCopied = $('<div class="gx-tooltip" style="display:none">Copied to Clipboard</div>'),

                titleText = title.text(),
                extracted = V.formula(titleText),
                titleAndUrl = titleText + '\n' + location.href,
                evernoteString = '[Gemini - {0}] {1} {2}'.format(geminiNumber, titleAndUrl, location.href);


            geToolbar.appendTo(V.Selector.ProjectInfo);

            triggerShow.mouseover(function () {
                geToolbar.css('opacity', 1);
            });
            triggerShow.mouseout(function () {
                geToolbar.css('opacity', 0);
            });
            
            if (options.copyTitleAndUrl) {
                geToolbar.append(copyTitleAndUrl);
            }

            if (options.copyGitBranchName) {
                geToolbar.append(buttonCopyGitBranchName);
            }

            projectInfo.css('position', 'relative')
                .append(tooltipCopied);

            buttonCopyEvernote.attr('data-clipboard-text', evernoteString);
            copyTitleAndUrl.attr('data-clipboard-text', titleAndUrl);
            copyTitleAndUrl.attr('title', titleAndUrl);

            buttonCopyGitBranchName.attr('data-clipboard-text', extracted);
            buttonCopyGitBranchName.attr('title', extracted);

            new Clipboard(buttonCopyEvernote[0], {
                text: function (trigger) {
                    var s = trigger.getAttribute("data-clipboard-text");
                    console.log(s);
                    for (var i = 0; i < s.length; i++) {
                        //console.log(i, s[i], s[i].charCodeAt(0));
                    }
                    return s;
                }
            });

            new Clipboard(buttonCopyGitBranchName[0], {
                text: function (trigger) {
                    var s = trigger.getAttribute("data-clipboard-text");
                    //console.log(s);
                    for (var i = 0; i < s.length; i++) {
                        //console.log(i, s[i], s[i].charCodeAt(0));
                    }
                    return s;
                }
            });

            new Clipboard(copyTitleAndUrl[0], {
                text: function (trigger) {
                    var s = trigger.getAttribute("data-clipboard-text");
                    //console.log(s);
                    for (var i = 0; i < s.length; i++) {
                        //console.log(i, s[i], s[i].charCodeAt(0));
                    }
                    return s;
                }
            });

            function animateTooltip() {
                var button = $(this);

                tooltipCopied
                    .show().animate(
                        { top: "-100px" },
                        {
                            duration: 1000,
                            complete: function () {
                                tooltipCopied.css('display', 'none').css('top', 0);
                            }
                        }
                    );
            }

            buttonCopyEvernote.click(animateTooltip);
            copyTitleAndUrl.click(animateTooltip);
            buttonCopyGitBranchName.click(animateTooltip);
        }


    }
});

