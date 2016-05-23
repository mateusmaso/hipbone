(function() {
  var Backbone, Module, View, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    _.extend(View, Module);

    View.include(Backbone.Events);

    View.include(require("./bubble"));

    View.include(require("./content"));

    View.include(require("./context"));

    View.include(require("./populate"));

    View.include(require("./elements"));

    View.include(require("./template"));

    View.include(require("./lifecycle"));

    View.include(require("./properties"));

    View.include(require("./class_name_bindings"));

    function View(properties, options) {
      if (properties == null) {
        properties = {};
      }
      if (options == null) {
        options = {};
      }
      this.initializeContext();
      this.initializeContent(options.content);
      this.initializePopulate();
      this.initializeTemplate();
      this.initializeElements();
      this.initializeProperties(properties);
      this.initializeClassNameBindings();
      View.__super__.constructor.call(this, options);
      this.lifecycle();
      this.prepare();
      this.render();
      this.on("change", this.update);
    }

    View.prototype.destroy = function() {};

    View.prototype._setElement = function() {
      return this.defineElement(View.__super__._setElement.apply(this, arguments));
    };

    View.prototype._setAttributes = function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return View.__super__._setAttributes.call(this, this.mergeAttributes(attributes));
    };

    View.prototype.$ = function(selector) {
      return View.__super__.$.call(this, this.getSelector(selector));
    };

    View.prototype.update = function() {
      this.updateContextBindings();
      return this.updateClassNameBindings();
    };

    View.prototype.render = function() {
      this.update();
      this.renderTemplate();
      return this.renderContent();
    };

    View.prototype.delegate = function(eventName, selector, listener) {
      return View.__super__.delegate.call(this, eventName, this.getSelector(selector), listener);
    };

    View.prototype.remove = function() {
      this.destroy();
      return View.__super__.remove.apply(this, arguments);
    };

    View.register("View");

    return View;

  })(Backbone.View);

}).call(this);
