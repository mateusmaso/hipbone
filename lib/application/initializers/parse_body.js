(function() {
  var Handlebars;

  Handlebars = require("handlebars");

  module.exports = function() {
    return this.on("run", function() {
      return Handlebars.parseHTML(document.body.childNodes);
    });
  };

}).call(this);
