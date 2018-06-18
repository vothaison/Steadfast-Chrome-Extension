/**
    
*/
V.modules.create({
    name: 'atlassian.rapidboard-modal',
    urlRegexes: [/https:\/\/steadfasttech\.atlassian\.net\/secure\/RapidBoard\.jspa.*modal=detail.*/i],
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

    },

    execute: function (settings) {
        console.info('Module atlassian.rapidboard-modal is running');
        var _self = this;

        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/lib/fontawesome/css/font-awesome.min.css", "css");
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/bitbucket/bitbucket.rapidboard-modal.css");


        var target;
        var SELECTOR = '[aria-label="Add attachment"]';
        var POLL_TIME = 6000;

        V.lib.poll(
            function () {
                target = $(SELECTOR).first();
                return target.length;
            },
            function () {
                console.info('poll success', SELECTOR)
                process();
            },
            function () {
                console.warn(SELECTOR, 'target element did not show up after ', POLL_TIME);
            },
            POLL_TIME, 300);

        function process() {
            var buttonLink = $('[aria-label="Create subtask"]').closest('[type="button"]').closest('div');

            var buttonCopy = $(
                '<div>' +
                '<span class="igMaON">' +
                '<button title="copy git branch name" class="jurdfZ sfx_btn-copy-git-branch-name" spacing="none" type="button">' +
                '<span style="align-self: center; display: inline-flex; flex-wrap: nowrap; max-width: 100%;">' +
                '<span style="align-self: center; display: flex; flex-shrink: 0; line-height: 0; font-size: 0px; margin: 0px; user-select: none;">' +
                '<span class="bsHrgL">' +
                '<span aria-label="copy git branch name" class="krfLtu sfx_btn-copy-git-branch-name__icon">' +
                '<i class="fa fa-git">' +
                '</span>' +
                '</span>' +
                '</span>' +
                '</span>' +
                '</button>' +
                '</span>' +
                '</div>'
            );

            buttonLink.parent().append(buttonCopy);

            var selectedIssue = _self.getParameterByName('selectedIssue');
            var summary = $('[role="dialog"]').find('h1').text().trim();
            var branchName = selectedIssue.replace(/-/g, '_') + '_' + V.formula(summary);

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
        }

        
    }
});


