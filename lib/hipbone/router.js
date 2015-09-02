(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Router = (function(superClass) {
    extend(Router, superClass);

    function Router(options) {
      if (options == null) {
        options = {};
      }
      this.matches = {};
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.buildUrl = function(name, params) {
      return Hipbone.app.routes[this.matches[name]].prototype.buildUrl(params);
    };

    Router.prototype.matchUrl = function(name) {
      return Hipbone.app.routes[this.matches[name]].prototype.matchUrl;
    };

    Router.prototype.match = function(name) {
      var url;
      this.matches[name] = (_.string.capitalize(name)) + "Route";
      url = this.matchUrl(name);
      return this.route(url, name, function() {
        var i, index, len, param, ref;
        this.params = Hipbone.history.parameters();
        ref = url.match(/:\w+/g) || [];
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          param = ref[index];
          if (arguments[index]) {
            this.params[param.substring(1)] = _.parse(arguments[index]);
          }
        }
        return this.route = new Hipbone.app.routes[this.matches[name]](this.params);
      });
    };

    Router.prototype.navigate = function(fragment, options) {
      var anchor;
      if (options == null) {
        options = {};
      }
      if (this.matches[fragment]) {
        fragment = this.buildUrl(fragment, options);
      }
      anchor = $("<a>").attr("href", fragment).get(0);
      if (options.params) {
        anchor.search = $.param(options.params);
      }
      fragment = anchor.pathname + anchor.search;
      if (options.reload) {
        return Hipbone.history.reload(fragment);
      } else if (options.load) {
        return Hipbone.history.loadUrl(fragment);
      } else {
        return Router.__super__.navigate.call(this, fragment, options);
      }
    };

    return Router;

  })(Backbone.Router);

}).call(this);
