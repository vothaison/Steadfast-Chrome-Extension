/**
    
*/
V.modules.create({
    name: 'bitbucket.diff-pages',
    urlRegexes: [
        /https:\/\/bitbucket\.org\/.+\/.+\/pull-requests\/.+\/diff/i, // Pull requests Overview
        /https:\/\/bitbucket\.org\/.+\/.+\/branch\/.+/i,
        /https:\/\/bitbucket\.org\/.+\/.+\/.+\/.+diff/i,
        /https:\/\/bitbucket\.org\/.+\/.+\/pull-requests\/new\?source=.+diff/i,
        /https:\/\/bitbucket\.org\/.+\/.+\/pull-requests\/.+\/.+diff/i
    ],
    runNow: true,
    alwaysOn: true,
    context: {

        setupMessages: function () {
            var _self = this;

            V.Extension.bitbucketPort.onMessage.addListener(function (msg) {
                switch (msg.response) {
                case 'response-complete-native-client':
                    console.log('V.Extension.boaPort.onMessage response href', msg);
                    break;
                }
            });
        },

        freezeThePlusSigns: function () {
            var preCount = 0;
            var preSpanCount = 0;
            var PRE_SOURCE = 'pre.source';
            var repolled = false;

            V.lib.poll(
                function () {
                    preCount = $(PRE_SOURCE).length;
                    return preCount;
                },
                function () {
                    transformPlusMinusSigns();
                },
                function () {
                    console.log('Poll failed for ' + PRE_SOURCE);
                },
                30 * 1000, 300);

            function transformPlusMinusSigns() {
                console.log(PRE_SOURCE, 'count:', $(PRE_SOURCE).length);

                $(PRE_SOURCE).each(function (i, pre) {
                    pre = $(pre);

                    if (pre.find('span[data-text]').length) {
                        return;
                    }

                    var html = pre.html();
                    var span = $('<span  data-text="' + html[0] + '"></span>');

                    pre.html(html.substring(1));
                    pre.prepend(span);
                });

                V.lib.addStylesheetRules([
                    [
                        'pre.source span::after', [
                            'content', 'attr(data-text);',
                        ],
                    ]
                ]);

                if (repolled) return;

                repolled = true;

                // Some how the diff is partly re-rendered.
                // We have to do another poll and call transformPlusMinusSigns if that happens.
                V.lib.poll(
                    function () {
                        preSpanCount = $('pre.source span[data-text]').length;
                        return preCount !== preSpanCount;
                    },
                    function () {
                        console.log('IT HAPPENS. Some how the diff is partly re-rendered. Call transformPlusMinusSigns() again');
                        transformPlusMinusSigns();
                    },
                    function () {
                        console.log('It is good. No recall transformPlusMinusSigns();');
                        preCount = $(PRE_SOURCE).length;
                    },
                    3000, 300);
            }
        },

        initLocateSourceFile: function () {
            var SELECTOR = '.iterable-item.file';
            var DIFF_ACTIONS_SELECTOR = '.diff-actions.secondary';
            var POLL_TIME = 30 * 1000;
            var fileItems, diffActions;
            var _self = this;

            console.log('initLocateSourceFile');

            if ($('.sfx_btn-open-in-vs').length) return;

            V.lib.poll(
                function () {
                    fileItems = $(SELECTOR).toArray();
                    return fileItems.length;
                },
                function () {
                    console.info('fileItems count', fileItems.length);
                    processFileItems();
                },
                function () {
                    console.warn('fileItems element did not show up after ', POLL_TIME);
                },
                POLL_TIME, 300);

            V.lib.poll(
                function () {
                    diffActions = $(DIFF_ACTIONS_SELECTOR).toArray();
                    return diffActions.length;
                },
                function () {
                    console.info('fileItems count', fileItems.length);
                    processDiffActions();
                },
                function () {
                    console.warn('fileItems element did not show up after ', POLL_TIME);
                },
                POLL_TIME, 300);


            function processFileItems() {
                fileItems.forEach(file => {
                    file = $(file);

                    var fileIdentifier = file.attr('data-file-identifier');
                    var fileName = file.find('.commit-files-summary--filename');
                    var vs = $('<span title="open in visual studio" class="sfx_btn-open-in-vs">vs<span>');
                    var git = $('<span title="git log" class="sfx_btn-open-git-log"><i class="fa fa-git"></i><span>');

                    file.append(vs);

                    vs.click(e => {
                        V.Extension.bitbucketPort.postMessage({
                            request: "post-" + "native-client",
                            data: {
                                ServiceName: 'LocateSourceFileByFileIdentifierService',
                                Request: {
                                    FileIdentifier: fileIdentifier,
                                    BoaSolutionFolder: _self.settings.boaSolutionFolder,
                                    LineNumber: 0
                                }
                            }
                        });
                    });

                });
            }
            
            function processDiffActions() {
                diffActions.forEach(diff => {
                    diff = $(diff);

                    var bigVS = $(
                        '<div class="aui-buttons">' +
                            '<button class="aui-button aui-button-light sfx_action-open-in-visual-studio" title="open in visual studio" >' +
                                'VS' +
                            '</button>' +
                        '</div>'
                        );
                    var showGitLog = $(
                        '<div class="aui-buttons">' +
                        '<button class="aui-button aui-button-light sfx_action-open-in-visual-studio" title="git log" >' +
                        'git' +
                        '</button>' +
                        '</div>'
                    );

                    diff.prepend(bigVS);

                    bigVS.click(e => {
                        V.Extension.bitbucketPort.postMessage({
                            request: "post-" + "native-client",
                            data: {
                                ServiceName: 'LocateSourceFileByFileIdentifierService',
                                Request: {
                                    FileIdentifier: diff.closest('.diff-container').find('.filename')[0].childNodes[2].textContent.trim(),
                                    BoaSolutionFolder: _self.settings.boaSolutionFolder,
                                    LineNumber: 0
                                }
                            }
                        });
                    });
                });
            }
        },

        initShowGitLog: function () {
            var SELECTOR = '.iterable-item.file';
            var DIFF_ACTIONS_SELECTOR = '.diff-actions.secondary';
            var POLL_TIME = 30*1000;
            var fileItems, diffActions;
            var _self = this;

            console.log('initLocateSourceFile');

            if ($('.sfx_btn-open-in-vs').length) return;

            V.lib.poll(
                function () {
                    fileItems = $(SELECTOR).toArray();
                    return fileItems.length;
                },
                function () {
                    console.info('fileItems count', fileItems.length);
                    processFileItems();
                },
                function () {
                    console.warn('fileItems element did not show up after ', POLL_TIME);
                },
                POLL_TIME, 300);

            V.lib.poll(
                function () {
                    diffActions = $(DIFF_ACTIONS_SELECTOR).toArray();
                    return diffActions.length;
                },
                function () {
                    console.info('fileItems count', fileItems.length);
                    processDiffActions();
                },
                function () {
                    console.warn('fileItems element did not show up after ', POLL_TIME);
                },
                POLL_TIME, 300);


            function processFileItems() {
                fileItems.forEach(file => {
                    file = $(file);

                    var fileIdentifier = file.attr('data-file-identifier');
                    var fileName = file.find('.commit-files-summary--filename');
                    var vs = $('<span title="open in visual studio" class="sfx_btn-open-in-vs">vs<span>');
                    var git = $('<span title="git log" class="sfx_btn-open-git-log"><i class="fa fa-git"></i><span>');

                    file.append(git);
                    
                    git.click(e => {
                        V.Extension.bitbucketPort.postMessage({
                            request: "post-" + "native-client",
                            data: {
                                ServiceName: 'OpenGitLogService',
                                Request: {
                                    FileIdentifier: fileIdentifier,
                                    BoaSolutionFolder: _self.settings.boaSolutionFolder,
                                    LineNumber: 0
                                }
                            }
                        });
                    });
                });
            }

            function processDiffActions() {
                diffActions.forEach(diff => {
                    diff = $(diff);

                    var bigVS = $(
                        '<div class="aui-buttons">' +
                            '<button class="aui-button aui-button-light sfx_action-open-in-visual-studio" title="open in visual studio" >' +
                                'VS' +
                            '</button>' +
                        '</div>'
                        );
                    var showGitLog = $(
                        '<div class="aui-buttons">' +
                        '<button class="aui-button aui-button-light sfx_action-open-git-log" title="git log" >' +
                        'git' +
                        '</button>' +
                        '</div>'
                    );

                    diff.prepend(showGitLog);
                    
                    showGitLog.click(e => {
                        V.Extension.bitbucketPort.postMessage({
                            request: "post-" + "native-client",
                            data: {
                                ServiceName: 'OpenGitLogService',
                                Request: {
                                    FileIdentifier: diff.closest('.diff-container').find('.filename')[0].childNodes[2].textContent.trim(),
                                    BoaSolutionFolder: _self.settings.boaSolutionFolder,
                                    LineNumber: 0
                                }
                            }
                        });
                    });
                });
            }
        }

    },

    execute: function (settings) {
        console.info('Module "bitbucket.diff-pages" is running');

        this.settings = settings;

        this.setupMessages();

        this.freezeThePlusSigns();

        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/bitbucket/bitbucket.diff-page.css");
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/lib/fontawesome/css/font-awesome.min.css", "css");

        if(settings.bitLocateFiles){
            this.initLocateSourceFile();
        }

        if (settings.bitShowGitLog) {
            this.initShowGitLog();
        }
    }
});


