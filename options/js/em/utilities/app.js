(function () { // Wrap in function to prevent accidental globals
   
    window.App = Em.Application.create({
        VERSION: "0.0.1",
        rootElement: "#ember-root"
    });
})();