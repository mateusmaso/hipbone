(function() {
  var Backbone, History, Module, Router, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  History = require("./../history");

  module.exports = Router = (function(superClass) {
    extend(Router, superClass);

    _.extend(Router, Module);

    Router.include(require("./url"));

    Router.include(require("./params"));

    Router.include(require("./matches"));

    Router.prototype.history = Backbone.history = new History;

    function Router(options) {
      if (options == null) {
        options = {};
      }
      this.initializeParams();
      this.initializeMatches();
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.execute = function(callback, args, name) {
      this.updateParams(this.matchUrlParams(name, args));
      return Router.__super__.execute.apply(this, arguments);
    };

    Router.prototype.navigate = function(fragment, options) {
      if (options == null) {
        options = {};
      }
      fragment = this.matchUrl(fragment, options.params) || this.url(fragment, options.params);
      if (options.reload) {
        return this.history.reload(fragment);
      } else if (options.load) {
        return this.history.loadUrl(fragment);
      } else {
        return Router.__super__.navigate.call(this, fragment, options);
      }
    };

    Router.prototype.restart = function() {
      this.history.stop();
      this.history.start({
        pushState: true
      });
      return this.trigger("restart");
    };

    Router.prototype.start = function() {
      if (Backbone.History.started) {
        return;
      }
      this.history.start({
        pushState: true
      });
      return this.trigger("start");
    };

    Router.register("Router");

    return Router;

  })(Backbone.Router);

}).call(this);
