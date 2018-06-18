
V.modules.create({
    name: 'showGitFastToolbar',
    optionName: 'showGitFastToolbar',
    urlRegexes: [V.Gemini.UrlRegexes.ItemDetailsPage],
    runNow: true,
    context: {

        gitInfoHtml: '<div class="gx-git-info">',
        btnHtml: '<a class="gx-git-info_command-button" href="#"">Check GIT Status</a>',
        statusHtml: '<span class="gx-git-info_status" href="#">Status</span>',
        loadingImageHtml: '<img class="gx-git-info_loading-image" />',
        gitImageHtml: '<img class="gx-git-info_git-icon"/>',
        loadingImageUrl: chrome.extension.getURL("images/loading3.gif"),
        gitImageUrl: chrome.extension.getURL("images/Git-Icon-Black.png"),

        checkGitStatus: function () {
            var self = this;

            this.status.hide();
            this.button.html("Checking git status");
            this.loadingImage.show();

            var title = $(V.Selector.ItemTitle);
            var titleText = title.text();
            var extracted = V.formula(titleText);


            var callback = function (data) {
                console.log(data);
                if (!data.response) {
                    self.loadingImage.hide();
                    self.status.html("Git native application not found").css('background-color', 'gray').show();
                    return;

                }
                var resObject = JSON.parse(data.response.data);


                self.status.html(resObject.message);
                self.button.html(resObject.command).attr('data-command', resObject.command);

                self.status.show();
                self.loadingImage.hide();

                if (resObject.message.indexOf("You git is NOT clean") !== -1) {
                    self.status.css('background-color', "darkred");
                } else {
                    self.status.css('background-color', "green");
                }
            };

            function sendRequest(key) {
                V.Extension.port.postMessage({
                    request: "get-" + key,
                    branchName: extracted
                });
            }

            var key = 'can-switch-branch';
            V.Extension.port.onMessage.addListener(function (msg) {
                if (msg.response === "return-" + key) {
                    console.log(msg);
                    callback(msg.data);

                }
            });

            sendRequest(key);
        },

        createNewBranch: function () {
            var title = $(V.Selector.ItemTitle);
            var titleText = title.text();
            var extracted = V.formula(titleText);

            V.Extension.port.postMessage({
                request: "get-" + "perform-git-action",
                branchName: extracted,
                gitRequest: "create-new-branch"
            });
        },

        checkoutThisBranch: function () {
            var title = $(V.Selector.ItemTitle);
            var titleText = title.text();
            var extracted = V.formula(titleText);

            V.Extension.port.postMessage({
                request: "get-" + "perform-git-action",
                branchName: extracted,
                gitRequest: "check-out-this-branch"
            });
        },

        initButton: function () {
            var self = this;

            V.Extension.port.onMessage.addListener(function (msg) {
                if (msg.response === "return-perform-git-action") {
                    self.checkGitStatus();
                }
            });

            this.button.click(function (e) {
                self.status.hide();
                self.button.html("Working");
                self.loadingImage.show();

                var command = $(this).attr('data-command');
                switch (command) {
                    case "Refresh Status":
                        self.checkGitStatus();
                        break;
                    case "Happy Coding":
                        console.log("Happy coding");
                        break;
                    case "Checkout This Branch":
                        console.log("Checkout This Branch");
                        self.checkoutThisBranch();
                        break;
                    case "Create New Branch":
                        console.log("Create New Branch");
                        self.createNewBranch();
                        break;
                }
            });
        }
    },
    execute: function (option) {
        this.loadingImage = $(this.loadingImageHtml);
        this.progressInfo = $(V.Selector.ProgressInfo);
        this.gitInfoOuter = this.progressInfo.parent();
        this.gitInfo = $(this.gitInfoHtml);
        this.status = $(this.statusHtml);
        this.gitImage = $(this.gitImageHtml);
        this.button = $(this.btnHtml);

        this.loadingImage.attr('src', this.loadingImageUrl);
        this.gitInfoOuter.addClass('gx-git-info_outer');
        this.progressInfo.addClass('gx-progress-info');

        this.gitImage.attr('src', this.gitImageUrl);
        this.gitInfo.insertAfter(V.Selector.ProgressInfo);
        this.button.appendTo(this.gitInfo);
        this.status.appendTo(this.gitInfo);

        this.loadingImage.insertAfter(this.status);
        this.gitImage.insertBefore(this.button);

        this.initButton();
        this.checkGitStatus();

    }
});
