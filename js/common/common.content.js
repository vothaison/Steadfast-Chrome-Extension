
V.augment({
    enableLog: true,
    /**
     * Just a wrapper for jQuery function
     */
    $: function (selector) {
        var selected = $(selector);

        if (!selected.length && V.Selector[selector]) {
            console.error("Cannot find element(s) with selector: " + selector);
        } else {
            //console.info("Found: " + selector);
        }

        return selected;
    },

    Extension: {
        port: chrome.runtime.connect({ name: "COMMON" }),
    },

    /**
     * Contains methods that help interact with background script
     */
    background: {
        utils: {
            evented: {},

            getAllTabUrls: function (callback, context) {
                var term = 'all-open-tab-urls';

                V.Extension.port.postMessage({ request: "get-" + term });

                if (!this.evented[term]) {
                    V.Extension.port.onMessage.addListener(function (msg) {
                        console.log(msg);
                        if (msg.response === "return-" + term) {
                            callback.call(context, msg.data);
                        }
                    });
                }
            },

            getRecentTen: function (callback, context) {
                var term = 'ten';

                V.Extension.port.postMessage({ request: "get-" + term });

                if (!this.evented[term]) {
                    V.Extension.port.onMessage.addListener(function (msg) {
                        console.log(msg);
                        if (msg.response === "return-" + term) {
                            callback.call(context, msg.data);
                        }
                    });
                }
            },

            get: function (term, callback, context) {
                V.Extension.port.postMessage({ request: "get-" + term });

                if (!this.evented[term]) {
                    V.Extension.port.onMessage.addListener(function (msg) {
                        console.log(msg);
                        if (msg.response === "return-" + term) {
                            callback.call(context, msg.data);
                        }
                    });
                }
            },

            set: function (term, data, callback, context) {

                V.Extension.port.postMessage({ request: "set-" + term, data: data });

                if (!this.evented[term]) {
                    V.Extension.port.onMessage.addListener(function (msg) {
                        console.log(msg);
                        if (msg.response === "response-" + term) {
                            callback.call(context, msg.data);
                        }
                    });
                }
            },

            setRecentTen: function (data, callback, context) {
                var term = 'ten';

                V.Extension.port.postMessage({ request: "set-" + term, data: data });

                if (!this.evented[term]) {
                    V.Extension.port.onMessage.addListener(function (msg) {
                        console.log(msg);
                        if (msg.response === "response-" + term) {
                            callback.call(context, msg.data);
                        }
                    });
                }
            }
        },

        evented: {},

        specs: {

        },

        getAllOptions: function (callback, spec) {
            var self = this;

            this.specs[spec.name] = spec;

            if (this.allOptions) {
                callback.call(spec, this.allOptions);
                return;
            }
            V.browser.requestOptions(function (options) {
                var spec = this;
                self.allOptions = options;
                callback.call(spec, options);
            }, spec);
        },
    },

    Modules: {},

    /**
     * Contains functions that will be mixed into module instances
     */
    moduleFunctions: {
        canRunAgainstUrl: function (url) {
            return this.urlRegexes && this.urlRegexes.some(function (regex) {
                return url.match(regex);
            });
        }
    },

    modules: {
        specs: {
        },

        /**
         * Create a module instance.
         * Put that instance into V.Modules to be executed later 
         */
        create: function (spec) {
            if (V.Modules[spec.name]) {
                throw "Module already exists: " + spec.name;
            }

            V.background.getAllOptions(function (options) {
                var spec = this;

                if (spec.alwaysOn || options[this.optionName]) {

                    V.Modules[spec.name] = {
                        name: spec.name,
                        spec: spec,
                        urlRegexes: spec.urlRegexes,
                        _executeFunction: spec.execute,
                        options: options,
                        execute: function () {
                            this._executeFunction.call(this.spec.context, this.options);
                        },
                        canRunAgainstUrl: V.moduleFunctions.canRunAgainstUrl
                    };

                    // Execute the module right away if spec.runNow = true;
                    if (spec.runNow) {
                        if (V.Modules[spec.name].canRunAgainstUrl(location.href)) {
                            V.Modules[spec.name].execute();
                        }
                    }
                }


            },
                spec);

            return V.Modules[spec.name];
        },
    },
    lib: {
        poll: function poll(fn, callback, errback, timeout, interval) {
            var endTime = Number(new Date()) + (timeout || 3000);
            interval = interval || 300;

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
        },

        loadjscssfile: function (filename, filetype) {
            var fileref;
            if (filetype === "js") { //if filename is a external JavaScript file
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", filename)
            } else if (filetype === "css") { //if filename is an external CSS file
                fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
                fileref.setAttribute('media', 'screen, projection');
            }
            if (typeof fileref != "undefined")
                document.getElementsByTagName("body")[0].appendChild(fileref);
        },

        loadJsFile: function (filename) {
            this.loadjscssfile(filename, 'js');
        },

        loadCssFile: function (filename) {
            this.loadjscssfile(filename, 'css');
        },

        gemini: {
            getTicketNumber: function () {
                var match =
                    /https:\/\/intranet.steadfasthub\.com\/.+\/workspace\/(\d+)\/item\/(\d+).*/.exec(location.href);
                var ticketNumber = match && match[2];
                return ticketNumber;

            },

            getRelativeTicketNumbers: function () {
                var matches = location.href.match(/(\d\d\d\d\d)/);
                return matches;

            }
        },

        /*
            Inject the function onto the page
            DANGER: THE FUNCTION PASSED IN executeProxyFunction DOES NOT HAVE CLOSURE of the current scope.            
    
        */
        executeProxyFunction: function (func) {
            var actualCode = '(' + func + ')();';
            var script = document.createElement('script');
            script.textContent = actualCode;
            (document.head || document.documentElement).appendChild(script);
            setTimeout(function () {
                script.parentNode.removeChild(script);
            },
                20000);

        }

    },

    Selector: (function () {
        return {
            AssignedTo: "#AssignedTo",
            AssignedToSpan: "span#AssignedTo",
            OpenProfile: ".item-small a.open-profile",
            TicketType: "#Type",
            ButtonAddComment: '#comments-content .button.add',
            ButtonSaveComment: '.cs-comment-add-save',
            LeftZone: '.left-zone',
            CommentWYSiWYG: '#comments-wysiwyg-content_ifr',
            AssignToDropdown: 'select[id="AssignedTo"]',
            ButtonConfirmChangeDropdown: '.inline-edit-dropdown .dropdown-options div',
            FirstTinyMCE: '.mce-container-body .mce-container.mce-toolbar.mce-first',
            InlineEditDropdown: '.inline-edit-dropdown',
            WatcherTableRows: '#watchers-content table tr',
            AuthorBox: '.author-box',
            AttributeContainer: '#attributes',
            ItemTitle: '.item-title',
            ProjectInfo: '.project-info',
            ProgressInfo: '.progress-info',
            WorkspaceTableData: '#TableData',
        }
    }())
});

if (V.enableLog) {
    LOG = console.log.bind(console);
} else {
    LOG = function () { };
}



V.lib.executeModules = function executeModules(newUrl) {
    for (var moduleName in V.Modules) {
        if (V.Modules.hasOwnProperty(moduleName)) {
            var module = V.Modules[moduleName];
            var canRunAgainstUrl = module.canRunAgainstUrl(newUrl);
            if (canRunAgainstUrl) {
                console.log("Execute module: ", moduleName);
                module.execute();
            }
        }
    }
}

V.lib.addEventListener = function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function () {
            handler.call(el);
        });
    }
}