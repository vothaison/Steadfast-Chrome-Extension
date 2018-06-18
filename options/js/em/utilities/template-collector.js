(function () {

    $('[template-name]').each(function() {
        var element = $(this);
        var name = element.attr('template-name');
        var content = element.html();
        Ember.TEMPLATES[name] = Ember.Handlebars.compile(content);
    });
})();