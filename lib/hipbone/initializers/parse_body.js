(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return this.on("run", function() {
      var key, ref, results, view;
      Handlebars.parseHTML(document.body.childNodes);
      ref = this.identityMap.match(/view/);
      results = [];
      for (key in ref) {
        view = ref[key];
        if (view instanceof this.views.ApplicationView) {
          results.push(this.appView = view);
        }
      }
      return results;
    });
  });

}).call(this);
