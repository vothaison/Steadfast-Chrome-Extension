V.augment({
    browser: {
        _cacheValue: null,

        requestOptions: function (callback, context) {
            if (this._cacheValue) {
                callback.call(context, this._cacheValue);
            } else {
                chrome.storage.sync.get({
                        options: {}
                    },
                    function(data) {
                        self.allOptions = data.options;
                        callback.call(context, data.options);
                        this._cacheValue = data.options;
                    });
            }
        },
    }
});
