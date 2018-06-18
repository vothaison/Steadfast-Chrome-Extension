
var currentUrl = window.location.href;
// Execute modules on start up
V.lib.executeModules(currentUrl);

//
// Execute modules everytime url change with popstate
//
window.addEventListener('popstate', function (e) {
    var newUrl = location.href;
    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        console.log('URL changed to', newUrl);
        V.lib.executeModules(newUrl);
    }
});

// Add an event listener.
V.lib.addEventListener(document, 'sfx_replaceState', function (e) {
    console.log('FIRE sfx_replaceState ', e);
    var newUrl = location.href;
    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        console.log('URL changed to', newUrl);
        V.lib.executeModules(newUrl);
    }
});

//
// Bitbucket uses replaceState
//
V.lib.executeProxyFunction(function () {
    var _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

    // Use it like this:
    window.addEventListener('replaceState', function (e) {
        console.info('replaceState happens', e);

        function triggerEvent(el, eventName, options) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, options);
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, options);
            }
            el.dispatchEvent(event);
        }

        // Trigger the event.
        triggerEvent(document, 'sfx_replaceState', {
            detail: 'VTS'
        });
    });
});

