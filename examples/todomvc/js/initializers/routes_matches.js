(function() {
  TodoMVC.prototype.initializers.push(function() {
    return this.router.match("root");
  });

}).call(this);
