/**
    
*/
var timeOut;

class Item {
    constructor(icon, backgroundColor, tooltip, click) {
        this.$element = $(document.createElement("div"));
        this.icon = icon;
        this.$element.addClass("sfx_item");
        this.$element.css("background-color", backgroundColor);
        var i = document.createElement("i");
        $(i).addClass("fa fa-" + icon);
        this.$element.append(i);
        this.prev = null;
        this.next = null;
        this.isMoving = false;
        var element = this;
        this.$element.on("mousemove", function () {
            clearTimeout(timeOut);
            timeOut = setTimeout(function () {
                if (element.next && element.isMoving) {
                    element.next.moveTo(element);
                }
            }, 10);
        });

        if (click) {
            this.$element.click(click);
        }

        this.$element.attr('title', tooltip);
    }

    moveTo(item) {
        anime({
            targets: this.$element[0],
            left: item.$element.css("left"),
            top: item.$element.css("top"),
            duration: 700,
            elasticity: 500
        });
        if (this.next) {
            this.next.moveTo(item);
        }
    }

    updatePosition() {
        anime({
            targets: this.$element[0],
            left: this.prev.$element.css("left"),
            top: this.prev.$element.css("top"),
            duration: 200
        });

        if (this.next) {
            this.next.updatePosition();
        }
    }
}

class Menu {
    constructor(menu) {
        this.$element = $(menu);
        this.size = 0;
        this.first = null;
        this.last = null;
        this.timeOut = null;
        this.hasMoved = false;
        this.status = "closed";
    }

    add(item) {
        var menu = this;
        if (this.first == null) {
            this.first = item;
            this.last = item;
            this.first.$element.on("mouseup", function () {
                if (menu.first.isMoving) {
                    menu.first.isMoving = false;
                } else {
                    menu.click();
                }
            });
            item.$element.draggable(
                {
                    start: function () {
                        menu.close();
                        item.isMoving = true;
                    }
                },
                {
                    drag: function () {
                        if (item.next) {
                            item.next.updatePosition();
                        }
                    }
                },
                {
                    stop: function () {
                        item.isMoving = false;
                        item.next.moveTo(item);
                    }
                }
            );
        } else {
            this.last.next = item;
            item.prev = this.last;
            this.last = item;
        }
        this.$element.after(item.$element);


    }

    open() {
        this.status = "open";
        var current = this.first.next;
        var iterator = 1;
        var head = this.first;
        var sens = head.$element.css("left") < head.$element.css("right") ? 1 : -1;
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: parseInt(head.$element.css("left"), 10) + (sens * (iterator * 50)),
                top: head.$element.css("top"),
                duration: 500
            });
            iterator++;
            current = current.next;
        }
    }

    close() {
        this.status = "closed";
        var current = this.first.next;
        var head = this.first;
        var iterator = 1;
        while (current != null) {
            anime({
                targets: current.$element[0],
                left: head.$element.css("left"),
                top: head.$element.css("top"),
                duration: 500
            });
            iterator++;
            current = current.next;
        }
    }

    click() {
        if (this.status == "closed") {
            this.open();
        } else {
            this.close();
        }
    }

}

V.modules.create({
    name: 'boa.all-page',

    urlRegexes: [
        /.+:\/\/localhost\/Boa\/*/i, // all boa page
    ],

    runNow: true,

    alwaysOn: true,

    context: {
        setupMessages: function() {
            var _self = this;

            V.Extension.boaPort.onMessage.addListener(function(msg) {
                switch (msg.response) {
                    case 'response-prepare-execute-menu-command':
                        if (msg.data.url !== location.href) {
                            return;
                        }
                        _self.locateSourceFile();

                        break;

                    case 'response-complete-native-client':
                        console.log('V.Extension.boaPort.onMessage response href', msg);
                        break;
                }
            });
        },

        locateSourceFile: function () {
            var _self = this;

            V.lib.executeProxyFunction(function () {
                if (!window.App) {
                    // Not an Ember page
                    return;
                }
                $('body').attr('data-currentRouteName', App.__container__.lookup('controller:application').currentRouteName);
                $('body').attr('data-pathname', location.pathname);
            });

            V.Extension.boaPort.postMessage({
                request: "post-" + "native-client",
                data: {
                    ServiceName: 'LocateSourceFileService',
                    Request: {
                        BoaSolutionFolder: this.settings.boaSolutionFolder,
                        CurrentRouteName: $('body').attr('data-currentRouteName'),
                        UrlPathName: $('body').attr('data-pathname'),
                    }
                }
            });
        },

        makeFloat: function () {
            if ($('#myMenu').length) return;
            V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/boa/in-page-menu.css", "css");

            var _self = this;
            var html = '<div class="sfx_center sfx_menu menu">' +
                '   <div id="myMenu"></div>' +
                '</div>';

            var body = $('body');
            body.append($(html));
            

            var menu = new Menu("#myMenu");

            menu.add(new Item("bolt", 'red', 'Actions'));

            //menu.add(new Item("asterisk", "green", 'dummy', function(e) {
            //    console.log('CLICK asterisk');
            //}));

            menu.add(new Item("file-code-o", "lightblue", 'locate source file', function (e) {
                _self.locateSourceFile();
            }));

            $(document).delay(50).queue(function (next) {
                menu.open();
                next();
                $(document).delay(1000).queue(function (next) {
                    menu.close();
                    next();
                });
            });
        },

        tellBackgroundHref: function() {
            return new Promise(resolve => {

                V.Extension.boaPort.postMessage({
                    request: "post-" + "native-client",
                    data: {
                        ServiceName: 'LocateSourceFileService',
                        Request: {
                            Href: location.href,
                        }
                    }
                });

            });
        }
    },

    execute: function (settings) {
        console.info('boa.all-page is running');
        this.settings = settings;
        this.setupMessages();

        if (settings.boaActionButtons) {
            this.makeFloat();
        }
        
    }
});


