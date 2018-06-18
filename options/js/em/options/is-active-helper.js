App.IsActiveHelper = Ember.Helper.helper(function (value) {
    console.log(value);
    var name = value[0];
    var hash = location.hash;

    return (hash.toLowerCase().indexOf(name.toLowerCase()) === 2);
});