/**
    
*/
V.modules.create({
    name: 'atlassian.browse',
    urlRegexes: [/https:\/\/steadfasttech\.atlassian\.net\/browse\/.+/i, /http:\/\/localhost:8100\/browse\/.+/i],
    runNow: true,
    alwaysOn: true,
    context: {
        getParameterByName: function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        issueClicked: function (e) {
            var _self = e.data.context;
            var idElement = $('#ghx-detail-head .ghx-detail-list').first()[0];
            var selectedIssue = $('#issuekey-val a').text();

            V.lib.poll(
                function () {
                    console.log($('[data-gx-name=button-copy]').length,
                        $('#issuekey-val a').text(),
                        selectedIssue,
                        $('#ghx-detail-head .ghx-detail-list').first()[0] !== idElement)
                    return !$('[data-gx-name=button-copy]').length &&
                        $('#issuekey-val a').text() === selectedIssue &&
                        $('#ghx-detail-head .ghx-detail-list').first()[0] !== idElement;
                },
                function () {
                    _self.generateBranchName();
                },
                function () {
                    console.warn('timed');

                },
                6000,
                300);

            console.log('issueClicked');
        },

        generateBranchName: function () {
            var selectedIssue = this.getParameterByName('selectedIssue');
            var summary = $('#summary-val').text();
            var branchName = selectedIssue.replace(/-/g, '_') + '_' + V.formula(summary);


            $('#ghx-detail-head .ghx-detail-list').first().append(btnHtml);

            var buttonCopy = $('[data-gx-name=button-copy]');

            buttonCopy.attr('data-clipboard-text', branchName);
            var clipboard = new Clipboard(buttonCopy[0],
                {
                    text: function (trigger) {
                        var s = trigger.getAttribute("data-clipboard-text");
                        console.log(s);
                        for (var i = 0; i < s.length; i++) {
                            //console.log(i, s[i], s[i].charCodeAt(0));
                        }
                        return s;
                    }
                });
            var tooltipCopied =
                $(
                    '<div class="gx-tooltip" style="display: none;position: absolute;left: calc(100% + 5px);top: 100%;">Copied</div>');

            function animateTooltip() {
                var button = $(this);

                tooltipCopied
                    .show().animate(
                        { top: "-100px" },
                        {
                            duration: 2000,
                            complete: function () {
                                tooltipCopied.css('display', 'none').css('top', '100%');
                            }
                        }
                    );
            }


            buttonCopy.closest('.ghx-detail-list').append(tooltipCopied);
            buttonCopy.click(animateTooltip);

        },

        listenToIssueClicked: function () {
            $('.js-issue.ghx-selected').on('click', { context: this }, this.issueClicked);
        },

        injectCss: function () {
            var fontFile = 'chrome-extension://{0}/fonts/museo-slab-300-webfont.woff'.format(chrome.runtime.id);
            V.sheet.injectCssRule(
                ("@font-face {"+
                    "font-family: MuseoSlab;"+
                    "font-weight: 300;"+
                    'src: url("{0}") format("woff"), url("{0}") format("truetype");'+
                "}").format(fontFile));


            fontFile = 'chrome-extension://{0}/fonts/museo-slab-500-2-webfont.eot?#iefix'.format(chrome.runtime.id);
            V.sheet.injectCssRule(
                ("@font-face {" +
                    "font-family: MuseoSlab;" +
                    "font-weight: 500;" +
                    'src: url("{0}") format("woff"), url("{0}") format("truetype");' +
                    "}").format(fontFile));

            fontFile = 'chrome-extension://{0}/fonts/museo-slab-700-webfont.eot?#iefix'.format(chrome.runtime.id);
            V.sheet.injectCssRule(
                ("@font-face {" +
                    "font-family: MuseoSlab;" +
                    "font-weight: 700;" +
                    'src: url("{0}") format("woff"), url("{0}") format("truetype");' +
                    "}").format(fontFile));
        }

    },

    execute: function () {
        console.info('Module "browse" is running');
        this.injectCss();

        var btnHtml =
            '<ul data-gx-name=button-copy="123" class="toolbar-group pluggable-ops">' +
                '<li class="toolbar-item">' +
                '<a title="Copy branch name" class="toolbar-trigger issueaction-comment-issue add-issue-comment inline-comment" href="#">' +
                '<span class="aui-icon aui-icon-small aui-iconfont-pages"></span>' +
                '<span class="trigger-label gx-font-MuseoSlab">&nbsp;&nbsp;Git Name</span>' +
                '</a>' +
                '</li>' +
           '</ul>';


        var container = $('.ops-menus.aui-toolbar .toolbar-split.toolbar-split-left');
        var title = $('#summary-val').text();
        var number = $('#key-val').text();
        var _title_ = V.formula(title.trim());
        var _number_ = V.formula(number.trim());
        var branchName = _number_.toUpperCase() + '_' + _title_;

        LOG('V.formula branchName', branchName);

        var buttonCopy = $(btnHtml);
        buttonCopy.attr('data-clipboard-text', branchName);
        buttonCopy.css('cursor', 'pointer');
        container.append(buttonCopy);

        //var tagA = buttonCopy.find('a.toolbar-trigger');
        //tagA.css('background', '#141614');
        //tagA.css('color', 'white');

        var clipboard = new Clipboard(buttonCopy[0], {
            text: function (trigger) {
                var s = trigger.getAttribute("data-clipboard-text");
                LOG(s);
                for (var i = 0; i < s.length; i++) {
                    //console.log(i, s[i], s[i].charCodeAt(0));
                }
                return s;
            }
        });
    }
});


