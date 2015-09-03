(function() {
  TodoMVC.prototype.initializers.push(function() {
    this.templates = HandlebarsTemplates;
    return this.templatePath = "js/templates";
  });

}).call(this);
