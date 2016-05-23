(function() {
  var Backbone, History, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  module.exports = History = (function(superClass) {
    extend(History, superClass);

    function History() {
      return History.__super__.constructor.apply(this, arguments);
    }

    _.extend(History, Module);

    History.include(require("./query"));

    History.prototype.route = function(route, callback) {
      return this.handlers.push({
        route: route,
        callback: callback
      });
    };

    History.prototype.reload = function(url) {
      if (url) {
        return this.location.assign(url);
      } else {
        return this.location.reload();
      }
    };

    History.prototype.getPathname = function() {
      return "/" + (this.getPath().replace(this.getSearch(), ""));
    };

    History.prototype.navigate = function(fragment, options) {
      this.popstate = false;
      return History.__super__.navigate.apply(this, arguments);
    };

    History.prototype.checkUrl = function(event) {
      this.popstate = true;
      return History.__super__.checkUrl.apply(this, arguments);
    };

    History.register("History");

    return History;

  })(Backbone.History);

}).call(this);
