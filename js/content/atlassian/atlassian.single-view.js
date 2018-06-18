/**
    
*/
V.modules.create({
    name: 'atlassian.single-view',
    urlRegexes: [/atlassian\.net\/.+?rapidView=.+&view=planning&/i],
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
                   console.log($('[data-gx-name=button-copy]').length, $('#issuekey-val a').text(), selectedIssue, $('#ghx-detail-head .ghx-detail-list').first()[0] !== idElement)
                   return !$('[data-gx-name=button-copy]').length && $('#issuekey-val a').text() === selectedIssue && $('#ghx-detail-head .ghx-detail-list').first()[0] !== idElement;
               },
               function () {
                   _self.generateBranchName();
               },
               function () {
                   console.warn('timed');

               }, 6000, 300);

            console.log('issueClicked');
        },

        generateBranchName: function () {
            var selectedIssue = this.getParameterByName('selectedIssue');
            var summary = $('#summary-val').text();
            var branchName = selectedIssue.replace(/-/g, '_') + '_' + V.formula(summary);


            var btnHtml = '&nbsp;&nbsp;&nbsp;&nbsp;<button title="Copy git branch name to clipboard" data-gx-name=button-copy class="aui-button ghx-actions aui-button-compact" style="height: 1.7em; background: lightcyan;">' +
                            '<span class="aui-icon aui-icon-small aui-iconfont-pages-large" style="height: 9px;">Actions Copy ' +
                            '</span>' +
                          '</button>';

            $('#ghx-detail-head .ghx-detail-list').first().append(btnHtml);

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

            var tooltipCopied = $('<div class="gx-tooltip" style="display: none;position: absolute;left: calc(100% + 5px);top: 100%;">Copied</div>');

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
        }

    },

    execute: function () {
        console.log('Module "single view" is running');
        $('[data-gx-name=button-copy]').remove();
        var selectedIssue = this.getParameterByName('selectedIssue');
        var _self = this;

        V.lib.poll(
            function () {
                return $('#issuekey-val a').text() === selectedIssue && $('#summary-val').text();
            },
            function () {
                _self.generateBranchName();
                _self.listenToIssueClicked();
            },
            function () {

            }, 6000, 300);
    }
});


