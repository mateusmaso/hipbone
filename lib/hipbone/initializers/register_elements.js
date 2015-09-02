(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    var View, name, ref, results;
    ref = this.views;
    results = [];
    for (name in ref) {
      View = ref[name];
      results.push((function(name, View) {
        return Handlebars.registerElement(View.prototype.elementName, function(attributes) {
          return new View(attributes, $(this).contents()).el;
        }, {
          booleans: View.prototype.booleans
        });
      })(name, View));
    }
    return results;
  });

}).call(this);
