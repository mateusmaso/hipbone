(function() {
  var Application, Backbone, Module, Router, Storage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./../module");

  Router = require("./../router");

  Storage = require("./../storage");

  Backbone = require("backbone");

  module.exports = Application = (function(superClass) {
    extend(Application, superClass);

    Application.include(Backbone.Events);

    Application.include(require("./ajax"));

    Application.include(require("./state"));

    Application.include(require("./locale"));

    Application.include(require("./initializers"));

    function Application(state, options) {
      if (state == null) {
        state = {};
      }
      if (options == null) {
        options = {};
      }
      this.initializeAjax();
      this.initializeState(state);
      this.initializeLocale(options.locale);
      this.initializeInitializers();
      this.router = new Router({
        title: this.title
      });
      this.storage = new Storage(this.prefix);
      this.runInitializers(options);
      this.initialize(options);
    }

    Application.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
    };

    Application.prototype.run = function() {
      this.trigger("run");
      return this.router.start();
    };

    Application.register("Application");

    return Application;

  })(Module);

}).call(this);
