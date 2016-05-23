(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeMatches: function() {
      return this.matches || (this.matches = {});
    },
    match: function(pattern, options) {
      if (options == null) {
        options = {};
      }
      this.matches[options.name] = options;
      return this.route(pattern, options.name, function() {
        var Route;
        Route = options.route;
        this._route = new Route(this.params, {
          pathname: this.history.getPathname(),
          popstate: this.history.popstate
        });
        return this._route.activate();
      });
    },
    matchUrl: function(name, params) {
      var fragment, match;
      if (params == null) {
        params = {};
      }
      if (match = this.matches[name]) {
        fragment = this.matchFragment(name, params);
        return this.url(fragment, _.omit(params, this.matchUrlParamKeys(name)));
      }
    },
    matchUrlParams: function(name, args) {
      var i, index, len, param, params, ref;
      params = {};
      ref = this.matchUrlParamKeys(name);
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        param = ref[index];
        if (args[index]) {
          params[param] = _.parse(args[index]);
        }
      }
      return params;
    },
    matchUrlParamKeys: function(name) {
      var i, len, param, ref, results;
      ref = this.matches[name].url.match(/:\w+/g) || [];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        param = ref[i];
        results.push(param.substring(1));
      }
      return results;
    },
    matchFragment: function(name, params) {
      var i, len, param, ref, url;
      if (params == null) {
        params = {};
      }
      url = this.matches[name].url;
      ref = this.matchUrlParamKeys(name);
      for (i = 0, len = ref.length; i < len; i++) {
        param = ref[i];
        url = url.replace(":" + param, params[param]);
      }
      return url;
    }
  };

}).call(this);
