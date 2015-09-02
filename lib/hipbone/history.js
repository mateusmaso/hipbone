(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.History = (function(superClass) {
    extend(History, superClass);

    function History() {
      return History.__super__.constructor.apply(this, arguments);
    }

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

    History.prototype.change = function(parameters) {
      var fragment, key, value;
      for (key in parameters) {
        value = parameters[key];
        if (value == null) {
          delete parameters[key];
        }
      }
      fragment = this.location.pathname;
      if (!_.isEmpty(parameters)) {
        fragment += "?" + ($.param(parameters));
      }
      return this.history.replaceState({}, document.title, fragment);
    };

    History.prototype.parameters = function() {
      var key, match, pair, parameters, regex, value;
      parameters = {};
      regex = /([^&=]+)=?([^&]*)/g;
      while (match = regex.exec(this.location.search.substring(1))) {
        pair = match[0], key = match[1], value = match[2];
        parameters[this.decode(key)] = _.parse(this.decode(value));
      }
      return parameters;
    };

    History.prototype.decode = function(string) {
      return decodeURIComponent(string.replace(/\+/g, " "));
    };

    History.prototype.checkUrl = function(event) {
      this.popstate = true;
      History.__super__.checkUrl.apply(this, arguments);
      return this.popstate = false;
    };

    return History;

  })(Backbone.History);

  Hipbone.history = Backbone.history = new Hipbone.History;

}).call(this);
