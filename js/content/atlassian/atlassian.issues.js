/**
    
*/
V.modules.create({
    name: 'atlassian.issues',
    urlRegexes: [/atlassian\.net\/projects\/.+\/issues\/.+/i, /atlassian\.net\/browse\/.+/i],
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
            var idElement = $('#key-val').first()[0];
            var selectedIssue = this.getIssueIdFromUrl();
            console.log('issueClicked');

            V.lib.poll(
               function () {
                   console.log('first poll', $('[data-gx-name=button-copy]').length, $('#key-val').text(), selectedIssue, $('#ghx-detail-head .ghx-detail-list').first()[0] !== idElement);
                   return !$('[data-gx-name=button-copy]').length && $('#key-val').text() === selectedIssue && $('#key-val').first()[0] !== idElement;
               },
               function () {
                   _self.generateBranchName();

                   V.lib.poll(
                       function () {
                           console.log('second poll', $('[data-gx-name=button-copy]').length);
                           return !$('[data-gx-name=button-copy]').length;
                       },
                       function () {
                           _self.generateBranchName();
                       },
                       function () {
                           console.warn('timed');

                       }, 6000, 300);

               },
               function () {
                   console.warn('timed');

               }, 6000, 300);

        },

        getIssueIdFromUrl: function() {
            var selectedIssue = (document.location.href.match(/atlassian\.net\/projects\/.+\/issues\/(.+)\?/i) ||
                document.location.href.match(/atlassian\.net\/browse\/(.+)\?/i))[1];
            return selectedIssue;
        },

        generateBranchName: function () {
            var selectedIssue = $('#key-val').text();
            var summary = $('#summary-val').text();
            var branchName = selectedIssue.replace(/-/g, '_') + '_' + V.formula(summary);


            var btnHtml = '<ul class="toolbar-group pluggable-ops" data-gx-name="button-copy-container" style="position: relative">' +
                '<li class="toolbar-item toolbar-analytics">' +
                '<button class="toolbar-trigger viewissue-share" style="background: lightcyan;" data-gx-name="button-copy">' +
                '<span class="aui-icon aui-icon-small aui-iconfont-devtools-branch"></span> <span class="trigger-label"></span>' +
                '</button>' +
                '</li>' +
                '</ul>';

            $('#stalker .toolbar-split-left').first().append(btnHtml);

            var buttonCopy = $('[data-gx-name=button-copy]');

            buttonCopy.attr('data-clipboard-text', branchName);

            new Clipboard(buttonCopy[0], {
                text: function (trigger) {
                    var s = trigger.getAttribute("data-clipboard-text");
                    console.log(s);
                    for (var i = 0; i < s.length; i++) {
                        //console.log(i, s[i], s[i].charCodeAt(0));
                    }
                    return s;
                }
            });

            var tooltipCopied = $('<div class="gx-tooltip" style="display: none;position: absolute;left: calc(100% + 5px);top: 100%;">Copied to Clipboard</div>');

            function animateTooltip() {
                var button = $(this);

                tooltipCopied
                    .show().animate(
                        { top: "-100px" },
                        {
                            duration: 2000,
                            complete: function() {
                                tooltipCopied.css('display', 'none').css('top', '100%');
                            }
                        }
                    );
            }

            
            buttonCopy.closest('ul').append(tooltipCopied);

            buttonCopy.click(animateTooltip);


        },

        listenToIssueClicked: function () {
            $('.issue-list li.focused').off('click').on('click', { context: this }, this.issueClicked);
        },


    },

    execute: function () {
        console.log('Module "issues" is running');
        $('[data-gx-name=button-copy]').remove();
        var selectedIssue = this.getIssueIdFromUrl();
        var _self = this;

        V.lib.poll(
            function () {
                return $('#key-val').text() === selectedIssue && $('#summary-val').text();
            },
            function () {
                _self.generateBranchName();
                _self.listenToIssueClicked();
            },
            function () {

            }, 6000, 300);
    }
});


