(function() {
  var $, Handlebars, _, dasherize, findBooleans;

  $ = require("jquery");

  _ = require("underscore");

  Handlebars = require("handlebars");

  dasherize = require("string-dasherize");

  findBooleans = function(attributes, internals) {
    var booleans, key, value;
    if (attributes == null) {
      attributes = {};
    }
    if (internals == null) {
      internals = [];
    }
    booleans = [];
    for (key in attributes) {
      value = attributes[key];
      if (_.isBoolean(value) && !_.contains(internals, key)) {
        booleans.push(key);
      }
    }
    return booleans;
  };

  module.exports = {
    registered: function() {
      var View;
      this.prototype.elementName = dasherize(this.prototype.moduleName || "").substring(1).replace("-view", "");
      this.prototype.booleans = findBooleans(this.prototype.defaults, this.prototype.internals);
      View = this;
      return Handlebars.registerElement(this.prototype.elementName, function(attributes) {
        return new View(attributes, {
          content: $(this).contents()
        }).el;
      }, {
        booleans: this.prototype.booleans
      });
    },
    initializeElements: function() {
      this.elementName || (this.elementName = "");
      this.elements || (this.elements = {});
      return this.booleans || (this.booleans = []);
    },
    getSelector: function(selector) {
      return this.elements[selector] || selector;
    },
    defineElement: function() {
      this.el.hipboneView = this;
      return this.el;
    },
    $view: function(selector) {
      if (this.$(selector)[0]) {
        return this.$(selector)[0].hipboneView;
      }
    }
  };

}).call(this);
