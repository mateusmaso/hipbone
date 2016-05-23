(function() {
  var $, Handlebars;

  $ = require("jquery");

  Handlebars = require("handlebars");

  module.exports = {
    initializeTemplate: function() {
      this.templates || (this.templates = {});
      this.templatePath || (this.templatePath = "");
      return this.templateName || (this.templateName = "");
    },
    template: function(path, context) {
      return $(Handlebars.parseHTML(this.getTemplate(path)(this.getContext(context))));
    },
    getTemplate: function(path) {
      return this.templates["" + this.templatePath + path];
    },
    renderTemplate: function() {
      Handlebars.unbind(this.el);
      if (this.templateName) {
        return this.$el.html(this.template(this.templateName));
      }
    }
  };

}).call(this);
