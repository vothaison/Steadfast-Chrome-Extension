
(function () {

    // Don't do anything if current product uses Ember 1.x
    if (Ember.VERSION[0] === '1') return;

    var controllerName = '';
    var floatingDiv = $('<div>');
    var timer;
    var body = $('body');
    var html = '<input type="text" data-provide="typeahead" class="sf_controller_observer_input" autocomplete="off">' +
        '<button class="sf_controller_observer_button_reset" title="clear current value">X</button>' +
        '<button class="sf_controller_observer_button_go" title="get value of current selected property">Go</button>' +
        '';

    var props = [];
    var controllerInstance = null;

    floatingDiv.attr('id', 'sf_controller_observer');
    floatingDiv.attr('class', 'sf_controller_observer');
    floatingDiv.css('bottom', '-1100px');

    floatingDiv.html(html);

    body.append(floatingDiv);

    var inputTag = $('.sf_controller_observer_input');
    var buttonGo = $('.sf_controller_observer_button_go');
    var buttonReset = $('.sf_controller_observer_button_reset');

    function getControllerNameFromUrl() {

        var lookupFunctionBody = $('body').attr('data-sf_controller_name_lookup_function');
        var lookupFunction = new Function(lookupFunctionBody);
        return lookupFunction();
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function updateControllerInformation() {

        controllerName = getControllerNameFromUrl();

        controllerInstance = App.__container__.lookup('controller:' + controllerName);

        var modelDef = controllerInstance.get('modelDef');

        if (modelDef) {
            props = Object.keys(controllerInstance);

            // Computed properties live in controllerInstance.__proto__.__proto__
            props.pushObjects(Object.keys(controllerInstance.__proto__.__proto__));

            // Parent controller's properties live in controllerInstance.__proto__.__proto__.__proto__
            props.pushObjects(Object.keys(controllerInstance.__proto__.__proto__.__proto__));
            props.filter(onlyUnique).sort();
        }
    }

    function findMatches(q) {

        // an array that will be populated with substring matches
        var matches = [];

        // regex used to determine if a string contains the substring `q`
        var substringRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(props, function (i, str) {
            if (substringRegex.test(str)) {
                matches.push(str);
            }
        });

        return matches;
    };

    function showPropertyValue(propName) {
        var description = 'App.__container__.lookup(\'controller:' + controllerName + '\').get(\'' + propName + '\');';
        var value = controllerInstance.get(propName);
        console.log(description);
        console.info(value);
    }

    $(function () {
        inputTag.typeahead({
            hint: true,
            highlight: true,
            minLength: 0,
            classNames: {
                menu: 'tt-menu sf_controller_observer_menu',
            }
        },
            {
                name: 'autocomplete',
                limit: 100,
                source: function (query, syncResults, asyncResults) {

                    if (query === '') {
                        syncResults(props);
                    }

                    if (timer) {
                        clearTimeout(timer);
                    }

                    // Throttling request by setTimeout function.
                    timer = setTimeout(function () {
                        asyncResults(findMatches(query));
                    },
                        300);
                }
            });

        inputTag.bind('typeahead:selected',
            function (ev, suggestion) {
                showPropertyValue(suggestion);
            });

        inputTag.keypress(function (event) {
            if (event.charCode === 13) {
                var value = inputTag.typeahead('val');
                showPropertyValue(value);
            }
        });

        buttonGo.click(function () {
            var value = inputTag.typeahead('val');
            if (value) {
                showPropertyValue(value);
            }
        });

        buttonReset.click(function () {
            inputTag.typeahead('val', '');
            inputTag.focus();
        });


        window.onhashchange = updateControllerInformation;
        updateControllerInformation();
    });

    //
    // Show/hide the observer when dev tool is shown/hidden
    //

    function addEventListener(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function () {
                handler.call(el);
            });
        }
    }

    var heardDevtoolDetector = false;

    // Add an event listener.
    addEventListener(document, 'devtoolsStatusChanged', function (e) {
        heardDevtoolDetector = true;
        if (e.detail === 'OPENED') {
            floatingDiv.css('bottom', '0');
        } else {
            floatingDiv.css('bottom', '-1100px');
        }
    });

    // If after 1 second we don't hear anything from Devtool status detector, we show the sneaky tool anyway
    setTimeout(function() {
        if (!heardDevtoolDetector) {
            floatingDiv.css('bottom', '0');
        }
    }, 1000);
}());


(function() {
    function addEventListener(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName,
                function() {
                    handler.call(el);
                });
        }
    }


    // Add an event listener.
    addEventListener(document, 'devtoolsStatusChanged', function(e) {
        if (e.detail === 'OPENED') {
            // Your code when Devtools opens
        } else {
            // Your code when Devtools Closed
        }
    });
});