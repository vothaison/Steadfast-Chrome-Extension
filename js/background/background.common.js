(function () {
    var STORAGE_KEY = 'gemini-extension' + chrome.runtime.id;

    function afterInstall() {
        // after install
        console.log('after install');
        if (!localStorage[STORAGE_KEY]) {
            localStorage[STORAGE_KEY] = true;
            return true;
        }
        return false;
    }

    function openOptionPage() {
        window.open('chrome-extension://' + chrome.runtime.id + '/html/options.html', '_blank');
    }

    if (afterInstall()) {
        openOptionPage();
    }

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          if (request.command == "get-all-open-tab-urls") {
              sendResponse({ text: "I have received the request. I will send message when I am done." });
              var urls = [];

              chrome.windows.getAll({ populate: true }, function (windows) {
                  windows.forEach(function (window) {
                      window.tabs.forEach(function (tab) {
                          //collect all of the urls here, 
                          urls.push(tab.url);
                      });


                  });
              });

              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                  chrome.tabs.sendMessage(tabs[0].id, { command: "return-all-open-tab-urls", value: urls }, function (response) {
                      //console.log(response);
                  });
              });
          }

      });


}());
