/**
    Define some global constants
*/
; (function (window) {

    V.Extension.svuPort = chrome.runtime.connect({ name: "svu" });

    V.SVU = V.SVU || {};

    V.SVU.UrlRegex = {
        AllPages: /http:\/\/localhost\/.+\/Forms\/Main\.ashx\?ssid=.+/i,
    }

}(window));