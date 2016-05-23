(function() {
  var Backbone, Module, Route, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  module.exports = Route = (function(superClass) {
    extend(Route, superClass);

    Route.include(Backbone.Events);

    Route.include(require("./store"));

    Route.include(require("./title"));

    Route.include(require("./element"));

    Route.include(require("./populate"));

    Route.include(require("./activate"));

    Route.include(require("./parameters"));

    function Route(params, options) {
      var route;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      if (route = this.initializeStore(params, options)) {
        return route;
      }
      this.cid = _.uniqueId('route');
      this.initializeTitle(options.titleRoot);
      this.initializeElement(options.elementRoot);
      this.initializePopulate();
      this.initializeParameters(params);
      this.initialize(params);
      this.storeChanges();
    }

    Route.prototype.initialize = function(params) {
      if (params == null) {
        params = {};
      }
    };

    Route.register("Route");

    return Route;

  })(Module);

}).call(this);
