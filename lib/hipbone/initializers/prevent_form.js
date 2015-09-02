(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  });

}).call(this);
