(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return this.on("run", function() {
      return this.trigger("start", Hipbone.history.start({
        pushState: true
      }));
    });
  });

}).call(this);
