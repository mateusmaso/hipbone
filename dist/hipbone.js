// hipbone
// ------------------
// v1.0.0
//
// Copyright (c) 2012-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/hipbone


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  window.Hipbone = {
    VERSION: '1.0.0',
    I18n: require("./hipbone/i18n"),
    View: require("./hipbone/view"),
    Model: require("./hipbone/model"),
    Route: require("./hipbone/route"),
    Module: require("./hipbone/module"),
    Router: require("./hipbone/router"),
    History: require("./hipbone/history"),
    Storage: require("./hipbone/storage"),
    Collection: require("./hipbone/collection"),
    Application: require("./hipbone/application"),
    IdentityMap: require("./hipbone/identity_map")
  };

}).call(this);

},{"./hipbone/application":2,"./hipbone/collection":22,"./hipbone/history":31,"./hipbone/i18n":32,"./hipbone/identity_map":33,"./hipbone/model":34,"./hipbone/module":43,"./hipbone/route":44,"./hipbone/router":52,"./hipbone/storage":55,"./hipbone/view":57}],2:[function(require,module,exports){
(function() {
  var Application, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Application = (function(superClass) {
    extend(Application, superClass);

    Application.registerModule("Application");

    Application.include(Backbone.Events);

    Application.include(require("./application/ajax"));

    Application.include(require("./application/models"));

    Application.include(require("./application/routes"));

    Application.include(require("./application/views"));

    Application.include(require("./application/templates"));

    Application.include(require("./application/collections"));

    Application.include(require("./application/state"));

    Application.include(require("./application/locales"));

    Application.include(require("./application/initializers"));

    function Application(options) {
      if (options == null) {
        options = {};
      }
      Hipbone.app = this;
      this.identityMap = new Hipbone.IdentityMap;
      this.initializeState(options.state, _.extend({
        title: "App",
        assets: {}
      }, options.stateDefaults));
      this.initializeTemplates(options.templatePath, options.templates);
      this.initializeViews(options.views);
      this.initializeModels(options.models);
      this.initializeRoutes(options.routes);
      this.initializeCollections(options.collections);
      this.initializeLocales(options.locales, options.locale);
      this.initializeAjax(options.ajaxHost, options.ajaxHeaders);
      this.initializeInitializers(options.initializers);
      this.history = Backbone.history = new Hipbone.History;
      this.router = new Hipbone.Router;
      this.storage = new Hipbone.Storage;
      this.runInitializers(options);
      this.initialize(options);
    }

    Application.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
    };

    Application.prototype.run = function() {
      return this.trigger('run');
    };

    return Application;

  })(Module);

}).call(this);

},{"./application/ajax":3,"./application/collections":4,"./application/initializers":5,"./application/locales":16,"./application/models":17,"./application/routes":18,"./application/state":19,"./application/templates":20,"./application/views":21,"./module":43}],3:[function(require,module,exports){
(function() {
  var slice = [].slice;

  module.exports = {
    initializeAjax: function(host, headers) {
      if (host == null) {
        host = "";
      }
      if (headers == null) {
        headers = {};
      }
      this.ajaxHost || (this.ajaxHost = host);
      return this.ajaxHeaders || (this.ajaxHeaders = headers);
    },
    ajax: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxHandle(Backbone.ajax(this.ajaxSettings(options)));
    },
    ajaxHandle: function(xhr) {
      xhr.done((function(_this) {
        return function() {
          return _this.trigger.apply(_this, ["ajaxSuccess"].concat(slice.call(arguments)));
        };
      })(this));
      xhr.fail((function(_this) {
        return function() {
          return _this.trigger.apply(_this, ["ajaxError"].concat(slice.call(arguments)));
        };
      })(this));
      return xhr;
    },
    ajaxSettings: function(options) {
      var header, ref, value;
      if (options == null) {
        options = {};
      }
      options.url = this.ajaxHost + options.url;
      if (options.type === 'POST') {
        options.dataType = 'json';
        options.contentType = 'application/json';
        options.data = JSON.stringify(options.data);
      }
      options.headers || (options.headers = {});
      ref = this.ajaxHeaders;
      for (header in ref) {
        value = ref[header];
        if (_.isFunction(value)) {
          value = value.apply(this);
        }
        options.headers[header] = value;
      }
      options.beforeSend = _.catenate(function(xhr, settings) {
        if (settings == null) {
          settings = {};
        }
        return xhr.settings = settings;
      }, options.beforeSend);
      return options;
    }
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  module.exports = {
    initializeCollections: function(collections) {
      var method, name, ref, results;
      if (collections == null) {
        collections = {};
      }
      this.collections = _.extend({}, this.collections, collections);
      ref = _.pick(this.constructor, _.functions(this.constructor));
      results = [];
      for (name in ref) {
        method = ref[name];
        if (method.prototype instanceof Hipbone.Collection) {
          results.push(this.collections[name] = method);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  module.exports = {
    initializers: [require("./initializers/sync"), require("./initializers/register_modules"), require("./initializers/register_elements"), require("./initializers/register_helpers"), require("./initializers/parse_body"), require("./initializers/parse_model"), require("./initializers/link_bridge"), require("./initializers/prevent_form"), require("./initializers/start_history")],
    initializeInitializers: function(initializers) {
      var i, initializer, len, results;
      if (initializers == null) {
        initializers = [];
      }
      results = [];
      for (i = 0, len = initializers.length; i < len; i++) {
        initializer = initializers[i];
        results.push(this.initializers.push(initializer));
      }
      return results;
    },
    runInitializers: function(options) {
      var i, initializer, len, ref, results;
      ref = this.initializers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        initializer = ref[i];
        results.push(initializer.apply(this, [options]));
      }
      return results;
    }
  };

}).call(this);

},{"./initializers/link_bridge":7,"./initializers/parse_body":8,"./initializers/parse_model":9,"./initializers/prevent_form":10,"./initializers/register_elements":11,"./initializers/register_helpers":12,"./initializers/register_modules":13,"./initializers/start_history":14,"./initializers/sync":15}],6:[function(require,module,exports){
(function() {
  module.exports = function() {
    var Collection, Model, Route, View, booleans, key, method, name, ref, ref1, results, setReflection, value;
    setReflection = function(Module, attribute, value) {
      if ((Module.prototype[attribute] == null) || _.isEqual(Module.__super__[attribute], Module.prototype[attribute])) {
        return Module.prototype[attribute] = value;
      }
    };
    ref = _.pick(this.constructor, _.functions(this.constructor));
    results = [];
    for (name in ref) {
      method = ref[name];
      if (method.prototype instanceof Hipbone.Model) {
        Model = this.models[name] = method;
        Model.prototype.defaults = _.extend({}, _.clone(Model.prototype.defaults), {
          type: name
        });
        setReflection(Model, "hashName", _.string.dasherize(name).substring(1));
      }
      if (method.prototype instanceof Hipbone.Route) {
        Route = this.routes[name] = method;
        setReflection(Route, "hashName", _.string.dasherize(name).substring(1));
      }
      if (method.prototype instanceof Hipbone.Collection) {
        Collection = this.collections[name] = method;
        setReflection(Collection, "hashName", _.string.dasherize(name).substring(1));
      }
      if (method.prototype instanceof Hipbone.View) {
        View = this.views[name] = method;
        booleans = [];
        ref1 = View.prototype.defaults;
        for (key in ref1) {
          value = ref1[key];
          if (_.isBoolean(value)) {
            booleans.push(key);
          }
        }
        setReflection(View, "hashName", _.string.dasherize(name).substring(1));
        setReflection(View, "booleans", booleans);
        results.push(setReflection(View, "elementName", _.string.dasherize(name).substring(1).replace("-view", "")));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

}).call(this);

},{}],7:[function(require,module,exports){
(function() {
  module.exports = function() {
    return $('body').on("click", "a:not([bypass])", (function(_this) {
      return function(event) {
        var href;
        if (!(event.ctrlKey || event.metaKey) && _this.history.location.hostname === event.currentTarget.hostname) {
          if (!$(event.currentTarget).attr("target") && (href = $(event.currentTarget).attr("href"))) {
            event.preventDefault();
            return _this.router.navigate(href, {
              trigger: true
            });
          }
        }
      };
    })(this));
  };

}).call(this);

},{}],8:[function(require,module,exports){
(function() {
  module.exports = function() {
    return this.on("run", function() {
      var key, ref, results, view;
      Handlebars.parseHTML(document.body.childNodes);
      ref = this.identityMap.match(/view/);
      results = [];
      for (key in ref) {
        view = ref[key];
        if (view instanceof this.views.ApplicationView) {
          results.push(this.appView = view);
        }
      }
      return results;
    });
  };

}).call(this);

},{}],9:[function(require,module,exports){
(function() {
  module.exports = function() {
    var parseValue;
    parseValue = Handlebars.parseValue;
    return Handlebars.parseValue = (function(_this) {
      return function(value, bool) {
        var model;
        value = parseValue.apply(_this, [value, bool]);
        if (value && (model = _this.identityMap.find(value.cid))) {
          value = model;
        }
        return value;
      };
    })(this);
  };

}).call(this);

},{}],10:[function(require,module,exports){
(function() {
  module.exports = function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  };

}).call(this);

},{}],11:[function(require,module,exports){
(function() {
  module.exports = function() {
    var View, name, ref, results;
    ref = this.views;
    results = [];
    for (name in ref) {
      View = ref[name];
      results.push((function(name, View) {
        return Handlebars.registerElement(View.elementName(), function(attributes) {
          return new View(attributes, $(this).contents()).el;
        }, {
          booleans: View.booleans()
        });
      })(name, View));
    }
    return results;
  };

}).call(this);

},{}],12:[function(require,module,exports){
(function() {
  var slice = [].slice;

  module.exports = function() {
    var app, eachHelper, ifHelper;
    app = this;
    Handlebars.registerHelper('asset', function(asset, options) {
      if (options == null) {
        options = {};
      }
      return app.get("assets")[asset];
    });
    Handlebars.registerHelper('t', function(key, options) {
      if (options == null) {
        options = {};
      }
      return app.i18n.t(key, options.hash);
    });
    Handlebars.registerHelper('url', function(name, options) {
      if (options == null) {
        options = {};
      }
      return app.router.url(name, options.hash);
    });
    Handlebars.registerHelper('fmt', function() {
      var formats, i, index, options, text;
      text = arguments[0], formats = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []), options = arguments[i++];
      if (options == null) {
        options = {};
      }
      index = 0;
      return text.replace(/%@/g, function(format) {
        return formats[index++];
      });
    });
    Handlebars.registerHelper('eval', function(javascript, options) {
      if (options == null) {
        options = {};
      }
      return eval(javascript);
    });
    Handlebars.registerHelper('template', function(path, options) {
      var context, template;
      if (options == null) {
        options = {};
      }
      context = _.isEmpty(options.hash) ? this : options.hash;
      template = app.getTemplate(path)(context);
      if (options.hash.unescape) {
        return template;
      } else {
        return new Handlebars.SafeString(template);
      }
    });
    eachHelper = Handlebars.helpers.each;
    Handlebars.registerHelper('each', function(items, options) {
      if (options == null) {
        options = {};
      }
      if (items) {
        items = items.models || items;
      }
      return eachHelper.apply(this, [items, options]);
    });
    ifHelper = Handlebars.helpers["if"];
    return Handlebars.registerHelper('if', function(conditional, options) {
      var ref;
      if (options == null) {
        options = {};
      }
      if (options.hash.bind && ((ref = _.path(this, conditional)) != null ? ref.models : void 0)) {
        conditional = conditional + ".models";
      } else if (conditional) {
        conditional = conditional.models || conditional;
      }
      return ifHelper.apply(this, [conditional, options]);
    });
  };

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  module.exports = function() {
    var module, moduleName, ref, results;
    ref = _.extend({}, this.views, this.models, this.routes, this.collections);
    results = [];
    for (moduleName in ref) {
      module = ref[moduleName];
      results.push(module.registerModule(moduleName));
    }
    return results;
  };

}).call(this);

},{}],14:[function(require,module,exports){
(function() {
  module.exports = function() {
    return this.on("run", function() {
      return this.trigger("start", this.history.start({
        pushState: true
      }));
    });
  };

}).call(this);

},{}],15:[function(require,module,exports){
(function() {
  module.exports = function() {
    var sync;
    sync = Backbone.sync;
    return Backbone.sync = (function(_this) {
      return function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options.sync = true;
        options.url || (options.url = model.url(options));
        options = _this.ajaxSettings(options);
        return _this.ajaxHandle(sync.apply(_this, [method, model, options]));
      };
    })(this);
  };

}).call(this);

},{}],16:[function(require,module,exports){
(function() {
  module.exports = {
    locales: {},
    initializeLocales: function(locale, locales) {
      if (locale == null) {
        locale = "en";
      }
      if (locales == null) {
        locales = {};
      }
      this.locale || (this.locale = locale);
      this.locales = _.extend(this.locales, locales);
      return this.i18n = new Hipbone.I18n(this.locale, this.locales);
    }
  };

}).call(this);

},{}],17:[function(require,module,exports){
(function() {
  module.exports = {
    initializeModels: function(models) {
      var method, name, ref, results;
      if (models == null) {
        models = {};
      }
      this.models = _.extend({}, this.models, models);
      ref = _.pick(this.constructor, _.functions(this.constructor));
      results = [];
      for (name in ref) {
        method = ref[name];
        if (method.prototype instanceof Hipbone.Model) {
          results.push(this.models[name] = method);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],18:[function(require,module,exports){
(function() {
  module.exports = {
    initializeRoutes: function(routes) {
      var method, name, ref, results;
      if (routes == null) {
        routes = {};
      }
      this.routes = _.extend({}, this.routes, routes);
      ref = _.pick(this.constructor, _.functions(this.constructor));
      results = [];
      for (name in ref) {
        method = ref[name];
        if (method.prototype instanceof Hipbone.Route) {
          results.push(this.routes[name] = method);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],19:[function(require,module,exports){
(function() {
  var Model, State,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Model = require("./../model");

  State = (function(superClass) {
    extend(State, superClass);

    function State() {
      return State.__super__.constructor.apply(this, arguments);
    }

    State.registerModule("State");

    return State;

  })(Model);

  module.exports = {
    initializeState: function(state, defaults) {
      if (state == null) {
        state = {};
      }
      if (defaults == null) {
        defaults = {};
      }
      State.prototype.defaults = defaults;
      this.state = new State(state);
      return this.listenTo(this.state, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    get: function() {
      return this.state.get.apply(this.state, arguments);
    },
    set: function() {
      return this.state.set.apply(this.state, arguments);
    }
  };

}).call(this);

},{"./../model":34}],20:[function(require,module,exports){
(function() {
  module.exports = {
    initializeTemplates: function(templatePath, templates) {
      if (templatePath == null) {
        templatePath = '';
      }
      if (templates == null) {
        templates = {};
      }
      this.templatePath || (this.templatePath = templatePath);
      return this.templates = _.extend({}, this.templates, templates);
    },
    getTemplate: function(path) {
      return this.templates["" + this.templatePath + path];
    }
  };

}).call(this);

},{}],21:[function(require,module,exports){
(function() {
  module.exports = {
    initializeViews: function(views) {
      var method, name, ref, results;
      if (views == null) {
        views = {};
      }
      this.views = _.extend({}, this.views, views);
      ref = _.pick(this.constructor, _.functions(this.constructor));
      results = [];
      for (name in ref) {
        method = ref[name];
        if (method.prototype instanceof Hipbone.View) {
          results.push(this.views[name] = method);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],22:[function(require,module,exports){
(function() {
  var Collection, Model, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Model = require("./model");

  Module = require("./module");

  module.exports = Collection = (function(superClass) {
    extend(Collection, superClass);

    _.extend(Collection, Module);

    Collection.registerModule("Collection");

    Collection.include(require("./collection/sync"));

    Collection.include(require("./collection/meta"));

    Collection.include(require("./collection/store"));

    Collection.include(require("./collection/parent"));

    Collection.include(require("./collection/filters"));

    Collection.include(require("./collection/populate"));

    Collection.include(require("./collection/pagination"));

    Collection.include(require("./collection/dynamic_model"));

    Collection.prototype.model = Model;

    function Collection(models, options) {
      var collection;
      if (options == null) {
        options = {};
      }
      if (!_.isArray(models)) {
        options = models || {};
        models = void 0;
      }
      if (collection = this.initializeStore(options.hashName, models, options)) {
        return collection;
      }
      this.cid = _.uniqueId('collection');
      this.initializeMeta(options.meta, options.metaDefaults);
      this.initializeParent(options.parent);
      this.initializeFilters(options.filters);
      this.initializePagination(options.pagination);
      Collection.__super__.constructor.apply(this, arguments);
      this.on("add remove reset sort", (function(_this) {
        return function() {
          return _this.trigger("update", _this);
        };
      })(this));
      this.on("all", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      this.store();
    }

    Collection.prototype._prepareModel = function(attributes, options) {
      if (options == null) {
        options = {};
      }
      this.prepareDynamicModel(attributes, options);
      return Collection.__super__._prepareModel.apply(this, arguments);
    };

    Collection.prototype.modelId = function(attributes) {
      return this.dynamicModelId(attributes) || Collection.__super__.modelId.apply(this, arguments);
    };

    Collection.prototype.url = function(options) {
      var query, url;
      query = this.toJSONFilters(options);
      url = this.parentUrl(options);
      if (!_.isEmpty(query)) {
        url = url + "?" + ($.param(query));
      }
      return url;
    };

    Collection.prototype.toJSON = function(options) {
      var json;
      if (options == null) {
        options = {};
      }
      json = Collection.__super__.toJSON.apply(this, arguments);
      if (!options.sync) {
        json = _.extend({
          cid: this.cid,
          length: this.length,
          meta: this.meta.toJSON(),
          models: json
        });
      }
      return json;
    };

    Collection.prototype.parse = function(response) {
      if (response == null) {
        response = {};
      }
      this.didSync();
      this.meta.set(response.meta);
      return response.models || response;
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);

},{"./collection/dynamic_model":23,"./collection/filters":24,"./collection/meta":25,"./collection/pagination":26,"./collection/parent":27,"./collection/populate":28,"./collection/store":29,"./collection/sync":30,"./model":34,"./module":43}],23:[function(require,module,exports){
(function() {
  module.exports = {
    prepareDynamicModel: function(attributes, options) {
      if (options == null) {
        options = {};
      }
      if (!this._isModel(attributes)) {
        return attributes = new (Hipbone.app.models[this.parseModelType(attributes)] || this.model)(attributes, options);
      }
    },
    parseModelType: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes.type;
    },
    dynamicModelId: function(attributes) {
      var Model;
      if (attributes == null) {
        attributes = {};
      }
      if (this.model && this._isModel(this.model.prototype)) {
        Model = this.model;
      } else {
        Model = Hipbone.app.models[this.parseModelType(attributes)];
      }
      if (attributes[Model.prototype.idAttribute]) {
        return attributes[Model.prototype.typeAttribute] + "-" + attributes[Model.prototype.idAttribute];
      }
    }
  };

}).call(this);

},{}],24:[function(require,module,exports){
(function() {
  module.exports = {
    initializeFilters: function(filters) {
      if (filters == null) {
        filters = {};
      }
      return this.filters = _.extend({}, this.filters, filters);
    },
    toJSONFilters: function(options) {
      var attribute, json, ref, value;
      if (options == null) {
        options = {};
      }
      json = {};
      ref = this.filters;
      for (attribute in ref) {
        value = ref[attribute];
        if (_.isFunction(value)) {
          value = value.apply(this, [options]);
        }
        if (value != null) {
          json[attribute] = value;
        }
      }
      return json;
    }
  };

}).call(this);

},{}],25:[function(require,module,exports){
(function() {
  var Meta, Model,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Model = require("./../model");

  Meta = (function(superClass) {
    extend(Meta, superClass);

    function Meta() {
      return Meta.__super__.constructor.apply(this, arguments);
    }

    Meta.registerModule("Meta");

    return Meta;

  })(Model);

  module.exports = {
    initializeMeta: function(meta, defaults) {
      if (meta == null) {
        meta = {};
      }
      if (defaults == null) {
        defaults = {};
      }
      Meta.prototype.defaults = defaults;
      this.meta = new Meta(meta);
      return this.listenTo(this.meta, "all", (function(_this) {
        return function() {
          var args, eventName;
          eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return _this.trigger.apply(_this, ["meta:" + eventName].concat(slice.call(args)));
        };
      })(this));
    }
  };

}).call(this);

},{"./../model":34}],26:[function(require,module,exports){
(function() {
  module.exports = {
    initializePagination: function(pagination) {
      if (pagination == null) {
        pagination = {};
      }
      this.pagination = _.extend({}, this.pagination, pagination);
      this.paginationOffset = this.pagination.offset;
      this.filters || (this.filters = {});
      this.filters.limit = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.paginationOffset != null) {
          if (options.paginate) {
            return this.pagination.limit;
          } else {
            return this.pagination.limit + this.paginationOffset;
          }
        }
      };
      return this.filters.offset = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.paginationOffset != null) {
          if (options.paginate) {
            return this.paginationOffset;
          } else {
            return 0;
          }
        }
      };
    },
    incrementPagination: function() {
      return this.paginationOffset = this.paginationOffset + this.pagination.limit;
    },
    decrementPagination: function() {
      return this.paginationOffset = this.paginationOffset - this.pagination.limit;
    },
    paginate: function(options) {
      if (options == null) {
        options = {};
      }
      this.incrementPagination();
      return this.fetch(_.extend({
        remove: false,
        paginate: true
      }, options));
    },
    hasMore: function() {
      return this.length < this.getPaginationCount();
    },
    getPaginationCount: function() {
      return this.meta.get('count');
    }
  };

}).call(this);

},{}],27:[function(require,module,exports){
(function() {
  module.exports = {
    initializeParent: function(parent) {
      return this.parent = parent;
    },
    setParent: function(parent, options) {
      if (options == null) {
        options = {};
      }
      if (this.parent !== parent) {
        this.parent = parent;
        if (!options.silent) {
          return this.trigger("change:parent", this.parent);
        }
      }
    },
    parentUrl: function(options) {
      if (options == null) {
        options = {};
      }
      if (this.parent) {
        return "" + (this.parent.url(options)) + this.urlRoot;
      } else {
        return this.urlRoot;
      }
    }
  };

}).call(this);

},{}],28:[function(require,module,exports){
(function() {
  module.exports = {
    populated: function(name) {
      return this.synced;
    },
    populate: function(name) {
      return this.fetch();
    },
    prepare: function(name) {
      return $.when(this.populated(name) || this.populate(name));
    }
  };

}).call(this);

},{}],29:[function(require,module,exports){
(function() {
  module.exports = {
    initializeStore: function(hashName, models, options) {
      var collection, hashes;
      this.hashName = hashName || _.string.dasherize(this.moduleName).substring(1);
      hashes = this.hashes(models, options);
      if (collection = Hipbone.app.identityMap.findAll(hashes)[0]) {
        if (models) {
          collection.set(models, options);
        }
        if (options.meta) {
          collection.meta.set(options.meta);
        }
        if (options.parent) {
          collection.setParent(options.parent);
        }
        return collection;
      } else {
        this.store(hashes);
        return null;
      }
    },
    hashes: function(models, options) {
      var hashes, ref;
      if (options == null) {
        options = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      if ((ref = options.parent) != null ? ref.cid : void 0) {
        hashes.push(this.hashName + "-" + options.parent.cid);
      }
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.models, {
        parent: this.parent,
        meta: this.meta
      }));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{}],30:[function(require,module,exports){
(function() {
  module.exports = {
    unsync: function() {
      delete this.synced;
      return this.trigger('unsync', this);
    },
    didSync: function() {
      this.synced = Date.now();
      return this.trigger('synced', this);
    }
  };

}).call(this);

},{}],31:[function(require,module,exports){
(function() {
  var History, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = History = (function(superClass) {
    extend(History, superClass);

    function History() {
      return History.__super__.constructor.apply(this, arguments);
    }

    _.extend(History, Module);

    History.registerModule("History");

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

}).call(this);

},{"./module":43}],32:[function(require,module,exports){
(function() {
  var I18n, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = I18n = (function(superClass) {
    extend(I18n, superClass);

    I18n.registerModule("I18n");

    function I18n(locale, locales, splitter) {
      if (locales == null) {
        locales = {};
      }
      this.locale = locale;
      this.locales = locales;
      this.splitter = splitter || /{{\w+}}/g;
    }

    I18n.prototype.interpolate = function(text, values) {
      var i, len, match, ref, value;
      if (values == null) {
        values = {};
      }
      ref = text.match(this.splitter) || [];
      for (i = 0, len = ref.length; i < len; i++) {
        match = ref[i];
        value = values[match.replace(/\W/g, "")];
        text = text.replace(match, value);
      }
      return text;
    };

    I18n.prototype.pluralize = function(key, count) {
      if (count === 0) {
        key = key + ".zero";
      } else if (count === 1) {
        key = key + ".one";
      } else {
        key = key + ".other";
      }
      return _.path(this.locales[this.locale], key);
    };

    I18n.prototype.inflector = function(key, gender) {
      if (gender === 'm') {
        key = key + ".male";
      } else if (gender === 'f') {
        key = key + ".female";
      } else {
        key = key + ".neutral";
      }
      return _.path(this.locales[this.locale], key);
    };

    I18n.prototype.translate = function(key, options) {
      var text;
      if (options == null) {
        options = {};
      }
      if (_.has(options, 'count')) {
        text = this.pluralize(key, options.count);
      } else if (_.has(options, 'gender')) {
        text = this.inflector(key, options.gender);
      } else {
        text = _.path(this.locales[this.locale], key);
      }
      return this.interpolate(text, options);
    };

    I18n.prototype.t = I18n.prototype.translate;

    return I18n;

  })(Module);

}).call(this);

},{"./module":43}],33:[function(require,module,exports){
(function() {
  var IdentityMap, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = IdentityMap = (function(superClass) {
    extend(IdentityMap, superClass);

    IdentityMap.registerModule("IdentityMap");

    function IdentityMap() {
      this.instances = {};
    }

    IdentityMap.prototype.match = function(regex) {
      var instance, key, matches, ref;
      matches = {};
      ref = this.instances;
      for (key in ref) {
        instance = ref[key];
        if (regex.test(key)) {
          matches[key] = instance.value;
        }
      }
      return matches;
    };

    IdentityMap.prototype.find = function(key) {
      var ref, value;
      if (value = (ref = this.instances[key]) != null ? ref.value : void 0) {
        this.store(key, value);
      }
      return value;
    };

    IdentityMap.prototype.findAll = function(keys) {
      var i, key, len, value, values;
      values = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        if (value = this.find(key)) {
          values.push(value);
        }
      }
      return values;
    };

    IdentityMap.prototype.store = function(key, value, options) {
      var defaults;
      if (options == null) {
        options = {};
      }
      defaults = {
        value: value
      };
      return this.instances[key] = _.extend(defaults, options);
    };

    IdentityMap.prototype.storeAll = function(keys, value, options) {
      var i, key, len, results;
      if (options == null) {
        options = {};
      }
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(this.store(key, value, options));
      }
      return results;
    };

    IdentityMap.prototype["delete"] = function(key) {
      return delete this.instances[key];
    };

    IdentityMap.prototype.deleteAll = function(keys) {
      var i, key, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(this["delete"](key));
      }
      return results;
    };

    IdentityMap.prototype.clear = function() {
      return this.deleteAll(_.keys(this.instances));
    };

    return IdentityMap;

  })(Module);

}).call(this);

},{"./module":43}],34:[function(require,module,exports){
(function() {
  var Model, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Model = (function(superClass) {
    extend(Model, superClass);

    _.extend(Model, Module);

    Model.registerModule("Model");

    Model.include(require("./model/type"));

    Model.include(require("./model/sync"));

    Model.include(require("./model/store"));

    Model.include(require("./model/mappings"));

    Model.include(require("./model/populate"));

    Model.include(require("./model/validations"));

    Model.include(require("./model/nested_attributes"));

    Model.include(require("./model/computed_attributes"));

    Model.prototype.cidPrefix = "model";

    function Model(attributes, options) {
      var model;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      if (model = this.initializeStore(options.hashName, attributes, options)) {
        return model;
      }
      this.initializeType(options.type, options.typeAttribute);
      this.initializeMappings(options.mappings, options.polymorphics);
      this.initializeValidations(options.validations);
      this.initializeComputedAttributes(options.computedAttributes);
      Model.__super__.constructor.apply(this, arguments);
      this.on("all", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      this.store();
    }

    Model.prototype.get = function(attribute) {
      if (this.mappings[attribute] || _.contains(this.polymorphics, attribute)) {
        return this.getMapping(attribute);
      } else if (this.computedAttributes[attribute]) {
        return this.getComputedAttribute(attribute);
      } else {
        return this.getNestedAttribute(attribute);
      }
    };

    Model.prototype.set = function(attribute, value, options) {
      var attributes;
      if (options == null) {
        options = {};
      }
      if (_.isObject(attribute)) {
        attributes = attribute;
        options = value || {};
      } else {
        attributes = {};
        attributes[attribute] = value;
      }
      this.setType(attributes);
      this.setMappings(attributes, options);
      this.setNestedAttributes(attributes, options);
      Model.__super__.set.call(this, attributes, options);
      return this.nestedChangeTrigger(options);
    };

    Model.prototype.toJSON = function(options) {
      var computedAttributes, json, mapping, mappingOptions, mappings;
      if (options == null) {
        options = {};
      }
      mappings = options.mappings || {};
      for (mapping in mappings) {
        mappingOptions = mappings[mapping];
        mappingOptions.sync = options.sync;
      }
      computedAttributes = options.computedAttributes || _.keys(this.computedAttributes);
      json = _.deepClone(Model.__super__.toJSON.apply(this, arguments));
      if (!options.sync) {
        json = _.extend(json, {
          cid: this.cid
        }, this.toJSONComputedAttributes(computedAttributes), this.toJSONMappings(mappings));
      }
      return json;
    };

    Model.prototype.parse = function(response) {
      if (response == null) {
        response = {};
      }
      this.didSync();
      return response;
    };

    return Model;

  })(Backbone.Model);

}).call(this);

},{"./model/computed_attributes":35,"./model/mappings":36,"./model/nested_attributes":37,"./model/populate":38,"./model/store":39,"./model/sync":40,"./model/type":41,"./model/validations":42,"./module":43}],35:[function(require,module,exports){
(function() {
  module.exports = {
    initializeComputedAttributes: function(computedAttributes) {
      if (computedAttributes == null) {
        computedAttributes = {};
      }
      return this.computedAttributes = _.extend({}, this.computedAttributes, computedAttributes);
    },
    getComputedAttribute: function(attribute) {
      var method;
      method = this.computedAttributes[attribute];
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        return method.apply(this);
      }
    },
    setComputedAttribute: function(attribute, value) {
      var method;
      method = this.computedAttributes[attribute];
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        return method.apply(this, [value]);
      }
    },
    toJSONComputedAttributes: function(computedAttributes) {
      var computedAttribute, i, json, len;
      json = {};
      for (i = 0, len = computedAttributes.length; i < len; i++) {
        computedAttribute = computedAttributes[i];
        json[computedAttribute] = this.getComputedAttribute(computedAttribute);
      }
      return json;
    }
  };

}).call(this);

},{}],36:[function(require,module,exports){
(function() {
  module.exports = {
    initializeMappings: function(mappings, polymorphics) {
      if (mappings == null) {
        mappings = {};
      }
      if (polymorphics == null) {
        polymorphics = [];
      }
      this.transients = {};
      this.mappings = _.extend({}, this.mappings, mappings);
      return this.polymorphics = _.union([], this.polymorphics, polymorphics);
    },
    mappingIdAttribute: function(mapping) {
      return mapping + "_id";
    },
    mappingTypeAttribute: function(mapping) {
      return mapping + "_type";
    },
    getMapping: function(mapping) {
      var attributes, collection, id, model, type;
      type = this.mappings[mapping];
      if (Hipbone.app.models[type] || _.contains(this.polymorphics, mapping)) {
        id = this.get(this.mappingIdAttribute(mapping));
        type = this.get(this.mappingTypeAttribute(mapping)) || type;
        attributes = {};
        attributes[Hipbone.app.models[type].prototype.idAttribute] = id;
        if (id) {
          model = new Hipbone.app.models[type](attributes);
        }
      } else if (Hipbone.app.collections[type]) {
        collection = new Hipbone.app.collections[type]({
          parent: this
        });
      }
      return model || collection || this.transients[mapping];
    },
    setMapping: function(mapping, value, options) {
      var collection, meta, model, models, type;
      if (options == null) {
        options = {};
      }
      type = this.mappings[mapping];
      if (value instanceof Hipbone.Model) {
        model = value;
      } else if (value instanceof Hipbone.Collection) {
        collection = value;
        collection.setParent(this);
      } else if (Hipbone.app.models[type] || _.contains(this.polymorphics, mapping)) {
        type = this.parseMappingType(mapping, value) || type;
        if (value) {
          model = new Hipbone.app.models[type](value, options);
        }
      } else if (Hipbone.app.collections[type]) {
        if (_.isArray(value)) {
          models = value;
        } else if (_.isObject(value)) {
          meta = value.meta;
          models = value.models;
        }
        collection = new Hipbone.app.collections[type](models, _.extend(options, {
          parent: this,
          meta: meta
        }));
      }
      if (model) {
        this.set(this.mappingIdAttribute(mapping), model.id);
        if (_.contains(this.polymorphics, mapping)) {
          this.set(this.mappingTypeAttribute(mapping), model.type);
        }
        if (model.isNew()) {
          this.transients[mapping] = model;
        }
      } else if (collection) {
        this.transients[mapping] = collection;
      } else {
        delete this.transients[mapping];
        this.unset(this.mappingIdAttribute(mapping));
        this.unset(this.mappingTypeAttribute(mapping));
      }
      return model || collection;
    },
    setMappings: function(attributes) {
      var attribute, ref, results, value;
      if (attributes == null) {
        attributes = {};
      }
      ref = _.pick(attributes, _.keys(this.mappings), this.polymorphics);
      results = [];
      for (attribute in ref) {
        value = ref[attribute];
        this.setMapping(attribute, value, {
          parse: true
        });
        results.push(delete attributes[attribute]);
      }
      return results;
    },
    parseMappingType: function(mapping, attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes.type;
    },
    toJSONMappings: function(mappings) {
      var json, mapping, options, ref;
      json = {};
      for (mapping in mappings) {
        options = mappings[mapping];
        json[mapping] = (ref = this.getMapping(mapping)) != null ? ref.toJSON(options) : void 0;
      }
      return json;
    }
  };

}).call(this);

},{}],37:[function(require,module,exports){
(function() {
  module.exports = {
    getNestedAttribute: function(attribute) {
      return _.path(this.attributes, attribute);
    },
    setNestedAttribute: function(attribute, value, options) {
      var i, len, nestedAttributes, path, previousAttribute, ref, results;
      if (options == null) {
        options = {};
      }
      value = attributes[attribute];
      delete attributes[attribute];
      if (!_.isEqual(this.get(attribute), value)) {
        nestedAttributes = {};
        nestedAttributes[attribute] = value;
        previousAttribute = this.get(attribute);
        this.attributes = _.pathExtend(this.attributes, nestedAttributes);
        if (!options.silent) {
          ref = _.clone(paths).reverse();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            path = ref[i];
            attribute = paths.join(".");
            paths.pop();
            this.nestedChanged[attribute] = value;
            results.push(this.trigger("change:" + attribute, this, previousAttribute, options));
          }
          return results;
        }
      }
    },
    setNestedAttributes: function(attributes, options) {
      var attribute, results, value;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      this.nestedChanged = {};
      results = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        if (!(attribute.split(".").length > 1)) {
          continue;
        }
        this.setNestedAttribute(attribute, value, options);
        results.push(delete attributes[attribute]);
      }
      return results;
    },
    nestedChangeTrigger: function(options) {
      if (_.keys(this.changed).length === 0 && _.keys(this.nestedChanged).length !== 0) {
        return this.trigger('change', this, options);
      }
    }
  };

}).call(this);

},{}],38:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],39:[function(require,module,exports){
(function() {
  module.exports = {
    initializeStore: function(hashName, attributes, options) {
      var hashes, model;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      this.hashName = hashName || _.string.dasherize(this.moduleName).substring(1);
      hashes = this.hashes(attributes);
      if (model = Hipbone.app.identityMap.findAll(hashes)[0]) {
        model.set(attributes, options);
        return model;
      } else {
        this.store(hashes);
        return null;
      }
    },
    hashes: function(attributes) {
      var hashes;
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      if (attributes[this.idAttribute]) {
        hashes.push(this.hashName + "-" + attributes[this.idAttribute]);
      }
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.attributes));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{}],40:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],41:[function(require,module,exports){
(function() {
  module.exports = {
    initializeType: function(type, attribute) {
      if (attribute == null) {
        attribute = "type";
      }
      this.type = type || this.moduleName;
      this.typeAttribute || (this.typeAttribute = attribute);
      return this.defaults = _.extend({}, _.clone(this.defaults), {
        type: this.type
      });
    },
    setType: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return this.type = attributes[this.typeAttribute] || this.type;
    }
  };

}).call(this);

},{}],42:[function(require,module,exports){
(function() {
  module.exports = {
    initializeValidations: function(validations) {
      if (validations == null) {
        validations = {};
      }
      this.errors = [];
      return this.validations = _.extend({}, this.validations, validations);
    },
    hasErrors: function(attributes) {
      if (attributes == null) {
        attributes = [];
      }
      if (_.isEmpty(attributes)) {
        return this.errors.length > 0;
      } else {
        return _.intersection(this.errors, attributes).length > 0;
      }
    },
    validate: function(attributes) {
      var attribute, validation, value;
      if (attributes == null) {
        attributes = {};
      }
      this.errors = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        validation = this.validations[attribute];
        if (validation && !validation.apply(this, [value, attributes])) {
          this.errors.push(attribute);
        }
      }
      if (this.hasErrors()) {
        return this.errors;
      }
    }
  };

}).call(this);

},{}],43:[function(require,module,exports){
(function() {
  var Module,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = Module = (function() {
    var moduleKeywords, modules;

    function Module() {}

    modules = [];

    moduleKeywords = ['included', 'extended'];

    Module.prototype.moduleName = "Module";

    Module.registerModule = function(name) {
      this.prototype.moduleName = name;
      return modules[name] = this;
    };

    Module.include = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        for (name in module) {
          method = module[name];
          if (indexOf.call(moduleKeywords, name) < 0) {
            this.prototype[name] = method;
          }
        }
        if (module.included) {
          results.push(module.included.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.extend = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        for (name in module) {
          method = module[name];
          if (indexOf.call(moduleKeywords, name) < 0) {
            this[name] = method;
          }
        }
        if (module.extended) {
          results.push(module.extended.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Module;

  })();

}).call(this);

},{}],44:[function(require,module,exports){
(function() {
  var Module, Route,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Route = (function(superClass) {
    extend(Route, superClass);

    Route.registerModule("Route");

    Route.include(Backbone.Events);

    Route.include(require("./route/url"));

    Route.include(require("./route/view"));

    Route.include(require("./route/title"));

    Route.include(require("./route/store"));

    Route.include(require("./route/active"));

    Route.include(require("./route/populate"));

    Route.include(require("./route/parameters"));

    function Route(params, options) {
      var route;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      if (route = this.initializeStore(options.hashName, params)) {
        return route;
      }
      this.cid = _.uniqueId('route');
      this.initializeView(options.templateName, options.contentTemplateName);
      this.initializeParameters(params, options.paramsDefaults);
      this.initialize(params);
      this.on("all", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      this.prepare();
      this.store();
    }

    Route.prototype.initialize = function(params) {
      if (params == null) {
        params = {};
      }
    };

    return Route;

  })(Module);

}).call(this);

},{"./module":43,"./route/active":45,"./route/parameters":46,"./route/populate":47,"./route/store":48,"./route/title":49,"./route/url":50,"./route/view":51}],45:[function(require,module,exports){
(function() {
  module.exports = {
    beforeActive: function() {
      return true;
    },
    active: function() {
      if (this.beforeActive() !== false) {
        this.updateTitle();
        return this.render();
      }
    }
  };

}).call(this);

},{}],46:[function(require,module,exports){
(function() {
  var Model, Parameters,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Model = require("./../model");

  Parameters = (function(superClass) {
    extend(Parameters, superClass);

    function Parameters() {
      return Parameters.__super__.constructor.apply(this, arguments);
    }

    Parameters.registerModule("Parameters");

    return Parameters;

  })(Model);

  module.exports = {
    initializeParameters: function(params, defaults) {
      if (params == null) {
        params = {};
      }
      if (defaults == null) {
        defaults = {};
      }
      Parameters.prototype.defaults = defaults;
      this.params = this.parameters = new Parameters(this.parse(params));
      return this.listenTo(this.params, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    get: function() {
      return this.params.get.apply(this.params, arguments);
    },
    set: function() {
      return this.params.set.apply(this.params, arguments);
    },
    parse: function(params) {
      if (params == null) {
        params = {};
      }
      return params;
    }
  };

}).call(this);

},{"./../model":34}],47:[function(require,module,exports){
(function() {
  module.exports = {
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      return $.when(this.populated(name) || this.populate(name));
    }
  };

}).call(this);

},{}],48:[function(require,module,exports){
(function() {
  module.exports = {
    initializeStore: function(hashName, params) {
      var hashes, path, route;
      if (params == null) {
        params = {};
      }
      this.hashName = hashName || _.string.dasherize(this.moduleName).substring(1);
      hashes = this.hashes(params);
      path = Hipbone.app.history.location.pathname;
      if (Hipbone.app.identityMap.find(path) && !Hipbone.app.history.popstate) {
        hashes = _.without(hashes, path);
      }
      if (route = Hipbone.app.identityMap.findAll(hashes)[0]) {
        route.set(params);
        return route;
      } else {
        this.store(hashes);
        return null;
      }
    },
    hashes: function(params) {
      var hashes;
      if (params == null) {
        params = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      hashes.push(Hipbone.app.history.location.pathname);
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.params.attributes));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{}],49:[function(require,module,exports){
(function() {
  module.exports = {
    title: function() {
      return Hipbone.app.get("title");
    },
    updateTitle: function() {
      return document.title = this.title();
    }
  };

}).call(this);

},{}],50:[function(require,module,exports){
(function() {
  module.exports = {
    initializeUrl: function(url) {
      if (url == null) {
        url = "";
      }
      return this.url || (this.url = url);
    },
    toURL: function(params) {
      if (params == null) {
        params = {};
      }
      return "";
    }
  };

}).call(this);

},{}],51:[function(require,module,exports){
(function() {
  module.exports = {
    initializeView: function(templateName, contentTemplateName) {
      this.templateName || (this.templateName = templateName || view.prototype.templateName);
      this.contentTemplateName || (this.contentTemplateName = contentTemplateName);
      return this._content = null;
    },
    context: function() {
      return {};
    },
    content: function() {
      return Hipbone.app.appView.template(this.contentTemplateName, this.context());
    },
    render: function() {
      this._content || (this._content = this.content());
      Hipbone.app.appView.set(this.context());
      if (Hipbone.app.appView.content !== this._content) {
        Hipbone.app.appView.content = this._content;
        Hipbone.app.appView.templateName = this.templateName;
        Hipbone.app.appView.$el.children().detach();
        return Hipbone.app.appView.render();
      }
    }
  };

}).call(this);

},{}],52:[function(require,module,exports){
(function() {
  var Module, Router,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Router = (function(superClass) {
    extend(Router, superClass);

    _.extend(Router, Module);

    Router.include(require("./router/url"));

    Router.include(require("./router/matches"));

    function Router(options) {
      if (options == null) {
        options = {};
      }
      this.initializeMatches(options.matches);
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.navigate = function(fragment, options) {
      if (options == null) {
        options = {};
      }
      fragment = this.urlFragment(fragment, options.params);
      if (options.reload) {
        return Hipbone.app.history.reload(fragment);
      } else if (options.load) {
        return Hipbone.app.history.loadUrl(fragment);
      } else {
        return Router.__super__.navigate.call(this, fragment, options);
      }
    };

    return Router;

  })(Backbone.Router);

}).call(this);

},{"./module":43,"./router/matches":53,"./router/url":54}],53:[function(require,module,exports){
(function() {
  module.exports = {
    initializeMatches: function(matches) {
      if (matches == null) {
        matches = {};
      }
      return this.matches = _.extend({}, this.matches, matches);
    },
    match: function(name) {
      var url;
      this.matches[name] = (_.string.capitalize(name)) + "Route";
      url = Hipbone.app.routes[this.matches[name]].prototype.url;
      return this.route(url, name, function() {
        var i, index, len, param, params, ref, route;
        params = Hipbone.app.history.parameters();
        ref = url.match(/:\w+/g) || [];
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          param = ref[index];
          if (arguments[index]) {
            params[param.substring(1)] = _.parse(arguments[index]);
          }
        }
        route = new Hipbone.app.routes[this.matches[name]](params);
        return route.active();
      });
    }
  };

}).call(this);

},{}],54:[function(require,module,exports){
(function() {
  module.exports = {
    url: function(name, params) {
      return Hipbone.app.routes[this.matches[name]].prototype.toURL(params);
    },
    urlFragment: function(fragment, params) {
      var anchor;
      if (this.matches[fragment]) {
        fragment = this.url(fragment, options.params);
      }
      anchor = $("<a>").attr("href", fragment).get(0);
      if (options.params) {
        anchor.search = $.param(options.params);
      }
      fragment = anchor.pathname + anchor.search;
      return fragment;
    }
  };

}).call(this);

},{}],55:[function(require,module,exports){
(function() {
  var Module, Storage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Storage = (function(superClass) {
    extend(Storage, superClass);

    function Storage() {
      return Storage.__super__.constructor.apply(this, arguments);
    }

    Storage.registerModule("Storage");

    Storage.prototype.match = function(regex) {
      var key, matches, value;
      matches = {};
      for (key in localStorage) {
        value = localStorage[key];
        if (regex.test(key)) {
          matches[key] = JSON.parse(value);
        }
      }
      return matches;
    };

    Storage.prototype.get = function(key) {
      var value;
      if (value = localStorage[key]) {
        return _.parse(value);
      }
    };

    Storage.prototype.set = function(key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.unset = function(key) {
      return localStorage.removeItem(key);
    };

    return Storage;

  })(Module);

}).call(this);

},{"./module":43}],56:[function(require,module,exports){
(function() {
  var sync;

  sync = Backbone.sync;

  module.exports = function(method, model, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    options.url || (options.url = model.url(options));
    options = Hipbone.app.ajaxSettings(options);
    return Hipbone.app.ajaxHandle(sync.apply(this, [method, model, options]));
  };

}).call(this);

},{}],57:[function(require,module,exports){
(function() {
  var Module, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    _.extend(View, Module);

    View.registerModule("View");

    View.include(Backbone.Events);

    View.include(require("./view/store"));

    View.include(require("./view/bubble"));

    View.include(require("./view/update"));

    View.include(require("./view/content"));

    View.include(require("./view/context"));

    View.include(require("./view/booleans"));

    View.include(require("./view/template"));

    View.include(require("./view/populate"));

    View.include(require("./view/elements"));

    View.include(require("./view/attribute"));

    View.include(require("./view/lifecycle"));

    View.include(require("./view/properties"));

    View.include(require("./view/view_selector"));

    View.include(require("./view/class_name_bindings"));

    function View(properties, content, options) {
      var view;
      if (properties == null) {
        properties = {};
      }
      if (options == null) {
        options = {};
      }
      if (view = this.initializeStore(options.hashName, properties)) {
        return view;
      }
      this.initializeContext();
      this.initializeContent(content, options.container);
      this.initializePopulate(options.background);
      this.initializeBooleans(options.booleans);
      this.initializeElements(options.elementName, options.elements);
      this.initializeTemplate(options.templateName);
      this.initializeProperties(properties);
      this.initializeClassNameBindings(options.classNameBindings);
      View.__super__.constructor.apply(this, arguments);
      this.on("change", (function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.on("all", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      this.lifecycle();
      this.prepare();
      this.render();
      this.store();
    }

    View.prototype.destroy = function() {};

    View.prototype._ensureElement = function() {
      View.__super__._ensureElement.apply(this, arguments);
      this.set({
        "class": this.el.className + " " + (this.get("class") || '')
      });
      this._setAttributes(this.properties.attributes);
      return this.assignViewFor(this.el);
    };

    View.prototype._setAttributes = function(attributes) {
      var attribute, results, value;
      if (attributes == null) {
        attributes = {};
      }
      results = [];
      for (attribute in attributes) {
        value = attributes[attribute];
        results.push(this.setAttribute(attribute, value));
      }
      return results;
    };

    View.prototype.$ = function(selector) {
      return View.__super__.$.call(this, this.getSelector(selector));
    };

    View.prototype.render = function() {
      this.update({
        immediate: true
      });
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

    return View;

  })(Backbone.View);

}).call(this);

},{"./module":43,"./view/attribute":58,"./view/booleans":59,"./view/bubble":60,"./view/class_name_bindings":62,"./view/content":63,"./view/context":64,"./view/elements":65,"./view/lifecycle":66,"./view/populate":67,"./view/properties":68,"./view/store":69,"./view/template":70,"./view/update":71,"./view/view_selector":72}],58:[function(require,module,exports){
(function() {
  module.exports = {
    setAttribute: function(attribute, value) {
      attribute = _.string.dasherize(attribute);
      if (attribute === "class") {
        return this.$el.addClass(value);
      } else if (_.contains(this.booleans, attribute)) {
        if (value) {
          return this.$el.attr(attribute, '');
        }
      } else if (!_.isObject(value)) {
        return this.$el.attr(attribute, value);
      }
    }
  };

}).call(this);

},{}],59:[function(require,module,exports){
(function() {
  module.exports = {
    included: function() {
      return this.booleans = function() {
        var booleans, key, ref, value;
        booleans = [];
        ref = this.prototype.defaults;
        for (key in ref) {
          value = ref[key];
          if (_.isBoolean(value)) {
            booleans.push(key);
          }
        }
        return booleans;
      };
    },
    initializeBooleans: function(booleans) {
      if (booleans) {
        return this.booleans = booleans;
      }
    }
  };

}).call(this);

},{}],60:[function(require,module,exports){
(function() {
  var slice = [].slice;

  module.exports = {
    bubble: function() {
      var args, eventName;
      eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.trigger.apply(this, arguments);
      return this.$el.trigger(eventName, args);
    }
  };

}).call(this);

},{}],61:[function(require,module,exports){
(function() {
  module.exports = {
    initializeClassBindings: function() {
      return this.classNameBindings || (this.classNameBindings = {});
    },
    updateClassBindings: function() {
      var callback, className, oldValue, ref, results, value;
      this._classNameBindings || (this._classNameBindings = {});
      ref = this.classNameBindings;
      results = [];
      for (className in ref) {
        callback = ref[className];
        oldValue = this._classNameBindings[className];
        value = this._classNameBindings[className] = callback.apply(this);
        if (_.isBoolean(value)) {
          if (value) {
            results.push(this.$el.addClass(className));
          } else {
            results.push(this.$el.removeClass(className));
          }
        } else if (value !== oldValue) {
          this.$el.removeClass(oldValue);
          results.push(this.$el.addClass(value));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],62:[function(require,module,exports){
(function() {
  module.exports = {
    initializeClassNameBindings: function() {
      return this.classNameBindings || (this.classNameBindings = {});
    },
    updateClassNameBindings: function() {
      var callback, className, oldValue, ref, results, value;
      this._classNameBindings || (this._classNameBindings = {});
      ref = this.classNameBindings;
      results = [];
      for (className in ref) {
        callback = ref[className];
        oldValue = this._classNameBindings[className];
        value = this._classNameBindings[className] = callback.apply(this);
        if (_.isBoolean(value)) {
          if (value) {
            results.push(this.$el.addClass(className));
          } else {
            results.push(this.$el.removeClass(className));
          }
        } else if (value !== oldValue) {
          this.$el.removeClass(oldValue);
          results.push(this.$el.addClass(value));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

},{}],63:[function(require,module,exports){
(function() {
  module.exports = {
    initializeContent: function(content, container) {
      this.content = content;
      return this.container = container;
    },
    renderContent: function() {
      if (this.content) {
        if (this.container) {
          return this.$(this.container).append(this.content);
        } else {
          return this.$el.append(this.content);
        }
      }
    }
  };

}).call(this);

},{}],64:[function(require,module,exports){
(function() {
  module.exports = {
    initializeContext: function() {
      return this._context = {};
    },
    context: function() {
      return {};
    },
    getContext: function(context) {
      if (context == null) {
        context = {};
      }
      if (_.isEmpty(context)) {
        return this._context;
      } else {
        return this.presentContext(context);
      }
    },
    presentContext: function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      ref = context = _.defaults(context, this.properties.attributes);
      for (key in ref) {
        value = ref[key];
        if (value instanceof Hipbone.Model || value instanceof Hipbone.Collection) {
          context[key] = value.toJSON();
        }
      }
      return context;
    },
    mergeContext: function(context) {
      if (context == null) {
        context = {};
      }
      jsondiffpatch.config.objectHash = function(object) {
        return (object != null ? object.cid : void 0) || object;
      };
      return jsondiffpatch.patch(this._context, jsondiffpatch.diff(this._context, context));
    },
    updateContext: function() {
      return this.mergeContext(this.presentContext(this.context()));
    },
    updateContextBindings: function() {
      return Platform.performMicrotaskCheckpoint();
    }
  };

}).call(this);

},{}],65:[function(require,module,exports){
(function() {
  module.exports = {
    included: function() {
      return this.elementName = function() {
        return _.string.dasherize(this.prototype.moduleName).substring(1).replace("-view", "");
      };
    },
    initializeElements: function(elementName, elements) {
      if (elements == null) {
        elements = {};
      }
      this.elements || (this.elements = {});
      if (elementName) {
        return this.elementName = elementName;
      }
    },
    getSelector: function(selector) {
      return this.elements[selector] || selector;
    }
  };

}).call(this);

},{}],66:[function(require,module,exports){
(function() {
  module.exports = {
    insert: function() {},
    detach: function() {},
    change: function(attribute, value) {},
    lifecycle: function() {
      return this.$el.lifecycle({
        insert: (function(_this) {
          return function() {
            _this.insert();
            return _this.trigger("insert");
          };
        })(this),
        remove: (function(_this) {
          return function() {
            _this.detach();
            return _this.trigger("detach");
          };
        })(this),
        change: (function(_this) {
          return function(attribute, value) {
            _this.change(attribute, value);
            attribute = _.string.camelize(attribute);
            return _this.set(attribute, Handlebars.parseValue(value, _.contains(_this.booleans, attribute)));
          };
        })(this)
      });
    }
  };

}).call(this);

},{}],67:[function(require,module,exports){
(function() {
  module.exports = {
    initializePopulate: function(background) {
      var populate, populated;
      this.background = false;
      populated = this.populated;
      this.populated = function(name) {
        return this.background || populated.apply(this, arguments);
      };
      populate = this.populate;
      return this.populate = function(name) {
        if (this.background) {
          return populate.apply(this, arguments);
        } else {
          this.set({
            loading: true
          });
          return populate.apply(this, arguments).done((function(_this) {
            return function() {
              return _this.set({
                loading: false
              });
            };
          })(this));
        }
      };
    },
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      return $.when(this.populated(name) || this.populate(name));
    }
  };

}).call(this);

},{}],68:[function(require,module,exports){
(function() {
  module.exports = {
    initializeProperties: function(properties) {
      if (properties == null) {
        properties = {};
      }
      this.props = this.properties = new Hipbone.Model(properties);
      return this.listenTo(this.props, "change", (function(_this) {
        return function() {
          return _this.trigger("change");
        };
      })(this));
    },
    get: function() {
      return this.props.get.apply(this.props, arguments);
    },
    set: function() {
      return this.props.set.apply(this.props, arguments);
    }
  };

}).call(this);

},{}],69:[function(require,module,exports){
(function() {
  module.exports = {
    initializeStore: function(hashName, properties) {
      var hashes, view;
      if (properties == null) {
        properties = {};
      }
      this.hashName = hashName || _.string.dasherize(this.moduleName).substring(1);
      hashes = this.hashes(properties);
      if (view = Hipbone.app.identityMap.findAll(hashes)[0]) {
        view.setContent(content);
        view.set(properties);
        return view;
      } else {
        this.store(hashes);
        return null;
      }
    },
    hashes: function(properties) {
      var hashes;
      if (properties == null) {
        properties = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes());
      return Hipbone.app.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{}],70:[function(require,module,exports){
(function() {
  module.exports = {
    initializeTemplate: function(templateName) {
      return this.templateName || (this.templateName = templateName);
    },
    template: function(path, context) {
      return $(Handlebars.parseHTML(this.getTemplate(path)(this.getContext(context))));
    },
    getTemplate: function(path) {
      return Hipbone.app.getTemplate(path);
    },
    renderTemplate: function() {
      if (this.templateName) {
        return this.$el.html(this.template(this.templateName));
      }
    }
  };

}).call(this);

},{}],71:[function(require,module,exports){
(function() {
  module.exports = {
    update: function(options) {
      if (options == null) {
        options = {};
      }
      if (options.immediate) {
        this.updateContext();
        this.updateContextBindings();
        return this.updateClassNameBindings();
      } else {
        return _.defer((function(_this) {
          return function() {
            _this.updateContext();
            _this.updateContextBindings();
            return _this.updateClassNameBindings();
          };
        })(this));
      }
    }
  };

}).call(this);

},{}],72:[function(require,module,exports){
(function() {
  module.exports = {
    assignViewFor: function(element) {
      return element.hipboneView = this;
    },
    $view: function(selector) {
      if (this.$(selector)[0]) {
        return this.$(selector)[0].hipboneView;
      }
    }
  };

}).call(this);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72]);
