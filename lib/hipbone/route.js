(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Route = (function(superClass) {
    extend(Route, superClass);

    Route.include(Hipbone.Accessor);

    Route.include(Backbone.Events);

    Route.prototype.hashName = "route";

    function Route(params) {
      var hashes, path, route;
      if (params == null) {
        params = {};
      }
      params = _.defaults({}, this.parse(params), this.defaults);
      hashes = this.hashes(params);
      path = Hipbone.history.location.pathname;
      if (Hipbone.app.identityMap.find(path) && !Hipbone.history.popstate) {
        hashes = _.without(hashes, path);
      }
      if (route = Hipbone.app.identityMap.findAll(hashes)[0]) {
        route.set(params);
        route.display();
        return route;
      } else {
        this.store(hashes);
      }
      this.cid = _.uniqueId('route');
      this.initializeAccessor({
        accessorsName: "params",
        accessors: params
      });
      this.initialize(params);
      this.populate();
    }

    Route.prototype.initialize = function() {};

    Route.prototype.setAccessor = function() {
      Hipbone.Accessor.setAccessor.apply(this, arguments);
      return this.store();
    };

    Route.prototype.fetch = function() {};

    Route.prototype.context = function() {};

    Route.prototype.transition = function() {};

    Route.prototype.populate = function() {
      return this.prepare().done((function(_this) {
        return function() {
          return _this.display();
        };
      })(this));
    };

    Route.prototype.display = function() {
      if (this.transition() !== false) {
        document.title = this.title();
        return this.render();
      }
    };

    Route.prototype.prepare = function() {
      return $.when(this.fetch());
    };

    Route.prototype.parse = function(params) {
      if (params == null) {
        params = {};
      }
      return params;
    };

    Route.prototype.hashes = function(params) {
      var hashes;
      if (params == null) {
        params = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      hashes.push(Hipbone.history.location.pathname);
      return hashes;
    };

    Route.prototype.buildUrl = function(params) {
      if (params == null) {
        params = {};
      }
    };

    Route.prototype.title = function() {
      return Hipbone.app.title;
    };

    Route.prototype.content = function() {
      return Hipbone.app.appView.template(this.contentName, this.context());
    };

    Route.prototype.render = function() {
      this.element || (this.element = this.content());
      Hipbone.app.appView.templateName = this.templateName;
      Hipbone.app.appView.set(this.context());
      if (Hipbone.app.appView.content !== this.element) {
        Hipbone.app.appView.setContent(null);
        Hipbone.app.appView.$el.children().detach();
        Hipbone.app.appView.render();
        return Hipbone.app.appView.setContent(this.element);
      }
    };

    Route.prototype.store = function(hashes) {
      hashes || (hashes = this.hashes(this.params));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    };

    return Route;

  })(Hipbone.Module);

}).call(this);
