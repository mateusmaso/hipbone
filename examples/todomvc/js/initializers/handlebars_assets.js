(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.templates = HandlebarsTemplates;
    return this.templatePath = "coffee/templates";
  });

}).call(this);
