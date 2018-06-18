/**
 * Global object, contains libraries, utilities, helpers.
 * This can be use in content scripts, background scripts
 */

if (window.V) throw { Error: "There is a global variable named V", V: V };

V = {};

/**
 "Mix" obj into V
*/
V.augment = function (obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (this.hasOwnProperty()) throw "Cannot override property " + prop + " of V";
            if (typeof obj[prop] === 'function') {
                this[prop] = obj[prop].bind(this);
            } else {
                this[prop] = obj[prop];
            }
        }
    }
}.bind(V);

V.augment({

    Const: {
        GeminiUrl: 'https://intranet.steadfasthub.com',
        GeminiItemUrl: "https://intranet.steadfasthub.com/AQGemini/workspace/0/item/",
        GeminiLogoUrl: 'chrome-extension://' + chrome.runtime.id + '/images/gemini-logo.jpg',
        GeminiIconPurpleUrl: 'chrome-extension://' + chrome.runtime.id + '/images/github-purple.png',
        GeminiIconGreenUrl: 'chrome-extension://' + chrome.runtime.id + '/images/github-green.png',
        GeminiIconBlackUrl: 'chrome-extension://' + chrome.runtime.id + '/images/github-black.png',
        GeminiIconLoadingUrl: 'chrome-extension://' + chrome.runtime.id + '/images/loading3.gif',
        GeminiSaveUrl: "https://intranet.steadfasthub.com/AQGemini/workspace/0/inline/save?viewtype=11",

        COPY_TITLE: 'Copy Title and Url',
        COPY_GIT_BRANCH_NAME: 'Copy GIT Branch to Clipboard'
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
    },

    sheet: {
        injectCssRule: function (ruleText) {


            if (arguments.length === 1) {
                // Treat ruleText as it is ruleText
            }

            if (arguments.length === 2) {
                var selector = arguments[0];
                var ruleObject = arguments[1];

                ruleText = this._makeCssRuleTextFromObject(selector, ruleObject);
            }


            //
            // Inject ruleText
            //

            // Create the <style> tag
            var style = document.createElement('style');

            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute('media', 'screen')
            // style.setAttribute('media', 'only screen and (max-width : 1024px)')

            // WebKit hack :(
            style.appendChild(document.createTextNode(ruleText));

            // Add the <style> element to the page
            document.head.appendChild(style);

            return style;
        },

        _makeCssRuleTextFromObject: function (selector, ruleObject) {
            var dummyJquery = $('<p>');
            dummyJquery.css(ruleObject);
            var ruleContent = dummyJquery.attr('style');
            var ruleText = '{0} \{ {1} \}'.format(selector, ruleContent);

            return ruleText;
        }
    }
});
