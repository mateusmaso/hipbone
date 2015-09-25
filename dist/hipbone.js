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

},{"./hipbone/application":2,"./hipbone/collection":13,"./hipbone/history":23,"./hipbone/i18n":24,"./hipbone/identity_map":25,"./hipbone/model":26,"./hipbone/module":36,"./hipbone/route":37,"./hipbone/router":44,"./hipbone/storage":47,"./hipbone/view":48}],2:[function(require,module,exports){
(function() {
  var Application, Module, Router, Storage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  Router = require("./router");

  Storage = require("./storage");

  module.exports = Application = (function(superClass) {
    extend(Application, superClass);

    Application.include(Backbone.Events);

    Application.include(require("./application/ajax"));

    Application.include(require("./application/state"));

    Application.include(require("./application/locale"));

    Application.include(require("./application/initializers"));

    function Application(state, options) {
      if (state == null) {
        state = {};
      }
      if (options == null) {
        options = {};
      }
      this.initializeAjax();
      this.initializeState(_.extend({
        assets: {}
      }, state));
      this.initializeLocale(options.locale);
      this.initializeInitializers();
      this.router = new Router({
        title: this.title
      });
      this.storage = new Storage({
        prefix: this.prefix
      });
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

},{"./application/ajax":3,"./application/initializers":4,"./application/locale":11,"./application/state":12,"./module":36,"./router":44,"./storage":47}],3:[function(require,module,exports){
(function() {
  var slice = [].slice;

  module.exports = {
    initializeAjax: function() {
      this.host || (this.host = "");
      return this.headers || (this.headers = {});
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
    ajaxUrl: function(url) {
      return "" + this.host + url;
    },
    ajaxHeaders: function() {
      var header, headers, ref, value;
      headers = {};
      ref = this.headers;
      for (header in ref) {
        value = ref[header];
        if (_.isFunction(value)) {
          value = value.apply(this);
        }
        headers[header] = value;
      }
      return headers;
    },
    ajaxSettings: function(options) {
      if (options == null) {
        options = {};
      }
      options.url = this.ajaxUrl(options.url);
      options.headers = _.extend({}, options.headers, this.ajaxHeaders());
      if (options.type === 'POST') {
        options.dataType = 'json';
        options.contentType = 'application/json';
        if (options.data) {
          options.data = JSON.stringify(options.data);
        }
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
    initializeInitializers: function() {
      this.initializers || (this.initializers = []);
      this.initializers.unshift(require("./initializers/parse_body"));
      this.initializers.unshift(require("./initializers/parse_model"));
      this.initializers.unshift(require("./initializers/link_bridge"));
      this.initializers.unshift(require("./initializers/prevent_form"));
      this.initializers.unshift(require("./initializers/prepare_sync"));
      return this.initializers.unshift(require("./initializers/register_helpers"));
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

},{"./initializers/link_bridge":5,"./initializers/parse_body":6,"./initializers/parse_model":7,"./initializers/prepare_sync":8,"./initializers/prevent_form":9,"./initializers/register_helpers":10}],5:[function(require,module,exports){
(function() {
  module.exports = function() {
    return $('body').on("click", "a:not([bypass])", (function(_this) {
      return function(event) {
        var href;
        if (!(event.ctrlKey || event.metaKey) && _this.router.history.location.hostname === event.currentTarget.hostname) {
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

},{}],6:[function(require,module,exports){
(function() {
  module.exports = function() {
    return this.on("run", function() {
      return Handlebars.parseHTML(document.body.childNodes);
    });
  };

}).call(this);

},{}],7:[function(require,module,exports){
(function() {
  var Collection, Model;

  Model = require("./../../model");

  Collection = require("./../../collection");

  module.exports = function() {
    var parseValue;
    parseValue = Handlebars.parseValue;
    return Handlebars.parseValue = (function(_this) {
      return function(value, bool) {
        var model;
        value = parseValue.apply(_this, [value, bool]);
        if (value && (model = Model.identityMap.find(value.cid) || Collection.identityMap.find(value.cid))) {
          value = model;
        }
        return value;
      };
    })(this);
  };

}).call(this);

},{"./../../collection":13,"./../../model":26}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
(function() {
  module.exports = function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  };

}).call(this);

},{}],10:[function(require,module,exports){
(function() {
  var View,
    slice = [].slice;

  View = require("./../../view");

  module.exports = function() {
    var eachHelper, ifHelper;
    Handlebars.registerHelper('asset', (function(_this) {
      return function(asset, options) {
        if (options == null) {
          options = {};
        }
        return _this.get("assets")[asset];
      };
    })(this));
    Handlebars.registerHelper('t', (function(_this) {
      return function(key, options) {
        if (options == null) {
          options = {};
        }
        return _this.i18n.t(key, options.hash);
      };
    })(this));
    Handlebars.registerHelper('url', (function(_this) {
      return function(name, options) {
        if (options == null) {
          options = {};
        }
        return _this.router.url(name, options.hash);
      };
    })(this));
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
      var template, view;
      if (options == null) {
        options = {};
      }
      view = View.identityMap.find(this.cid);
      template = view.getTemplate(path)(view.getContext(options.hash, this));
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

},{"./../../view":48}],11:[function(require,module,exports){
(function() {
  var I18n;

  I18n = require("./../i18n");

  module.exports = {
    initializeLocale: function(locale) {
      if (locale == null) {
        locale = "en";
      }
      this.locale || (this.locale = locale);
      this.locales || (this.locales = {});
      return this.i18n = new I18n(this.locale, this.locales);
    }
  };

}).call(this);

},{"./../i18n":24}],12:[function(require,module,exports){
(function() {
  var Model;

  Model = require("./../model");

  module.exports = {
    initializeState: function(state) {
      if (state == null) {
        state = {};
      }
      this.state = new (Model.define({
        defaults: this.defaults
      }))(state);
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

},{"./../model":26}],13:[function(require,module,exports){
(function() {
  var Collection, Model, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Model = require("./model");

  Module = require("./module");

  module.exports = Collection = (function(superClass) {
    extend(Collection, superClass);

    _.extend(Collection, Module);

    Collection.include(require("./collection/sync"));

    Collection.include(require("./collection/meta"));

    Collection.include(require("./collection/store"));

    Collection.include(require("./collection/parent"));

    Collection.include(require("./collection/filters"));

    Collection.include(require("./collection/populate"));

    Collection.include(require("./collection/pagination"));

    Collection.include(require("./collection/polymorphic"));

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
      if (collection = this.initializeStore(models, options)) {
        return collection;
      }
      this.cid = _.uniqueId('collection');
      this.initializeMeta(options.meta);
      this.initializeParent(options.parent);
      this.initializeFilters();
      this.initializePopulate();
      this.initializePagination();
      Collection.__super__.constructor.apply(this, arguments);
      this.store();
      this.on("all", _.debounce((function(_this) {
        return function() {
          return _this.store();
        };
      })(this)));
    }

    Collection.prototype._prepareModel = function(attributes, options) {
      var model;
      if (options == null) {
        options = {};
      }
      if (model = this.preparePolymorphic(attributes, options)) {
        attributes = model;
      }
      return Collection.__super__._prepareModel.call(this, attributes, options);
    };

    Collection.prototype.modelId = function(attributes) {
      if (_.isArray(this.model)) {
        return this.polymorphicUniqueId(attributes);
      } else {
        return Collection.__super__.modelId.apply(this, arguments);
      }
    };

    Collection.prototype.url = function(options) {
      var query, url;
      query = this.getFilters(options);
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
      if (response.meta) {
        this.meta.set(response.meta);
      }
      return response.models || response;
    };

    Collection.register("Collection");

    return Collection;

  })(Backbone.Collection);

}).call(this);

},{"./collection/filters":14,"./collection/meta":15,"./collection/pagination":16,"./collection/parent":17,"./collection/polymorphic":18,"./collection/populate":19,"./collection/store":20,"./collection/sync":21,"./model":26,"./module":36}],14:[function(require,module,exports){
(function() {
  module.exports = {
    initializeFilters: function() {
      return this.filters || (this.filters = {});
    },
    getFilters: function(options) {
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

},{}],15:[function(require,module,exports){
(function() {
  var Model,
    slice = [].slice;

  Model = require("./../model");

  module.exports = {
    initializeMeta: function(meta) {
      if (meta == null) {
        meta = {};
      }
      this.meta = new (Model.define({
        defaults: this.defaults
      }))(meta);
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

},{"./../model":26}],16:[function(require,module,exports){
(function() {
  module.exports = {
    initializePagination: function() {
      this.pagination || (this.pagination = {});
      this.limit = this.pagination.limit || 0;
      this.offset = this.pagination.offset || 0;
      this.filters || (this.filters = {});
      this.filters.limit = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.limit > 0) {
          if (options.paginate) {
            return this.limit;
          } else {
            return this.limit + this.offset;
          }
        }
      };
      this.filters.offset = function(options) {
        if (options == null) {
          options = {};
        }
        if (this.limit > 0) {
          if (options.paginate) {
            return this.offset;
          } else {
            return 0;
          }
        }
      };
      this.on("add", this.incrementCounter);
      this.on("remove", this.decrementCounter);
      return this.on("destroy", this.decrementCounter);
    },
    incrementPagination: function() {
      return this.offset = this.offset + this.limit;
    },
    decrementPagination: function() {
      return this.offset = this.offset - this.limit;
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
      return this.meta.get('count') || 0;
    },
    incrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has("count") && !options.parse) {
        return this.meta.set({
          count: this.meta.get("count") + 1
        });
      }
    },
    decrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has("count") && !options.parse) {
        return this.meta.set({
          count: this.meta.get("count") - 1
        });
      }
    }
  };

}).call(this);

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
(function() {
  module.exports = {
    preparePolymorphic: function(attributes, options) {
      var Model, i, len, ref;
      if (options == null) {
        options = {};
      }
      if (!this._isModel(attributes) && _.isArray(this.model)) {
        ref = this.model;
        for (i = 0, len = ref.length; i < len; i++) {
          Model = ref[i];
          if (Model.prototype.moduleName === this.polymorphicType(attributes)) {
            return new Model(attributes, options);
          }
        }
      }
    },
    polymorphicId: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.polymorphicIdAttribute(attributes)];
    },
    polymorphicType: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.polymorphicTypeAttribute(attributes)];
    },
    polymorphicIdAttribute: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return "id";
    },
    polymorphicTypeAttribute: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return "type";
    },
    polymorphicUniqueId: function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return (this.polymorphicId(attributes)) + "-" + (this.polymorphicType(attributes));
    }
  };

}).call(this);

},{}],19:[function(require,module,exports){
(function() {
  module.exports = {
    initializePopulate: function() {
      return this.deferreds = {};
    },
    populated: function(name) {
      return this.synced;
    },
    populate: function(name) {
      return this.fetch();
    },
    prepare: function(name) {
      var deferred;
      deferred = this.deferreds[name];
      if (deferred && !deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);

},{}],20:[function(require,module,exports){
(function() {
  var IdentityMap;

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = _.string.dasherize(this.prototype.moduleName).substring(1);
    },
    initializeStore: function(models, options) {
      var collection, hashes;
      hashes = this.hashes(models, options);
      if (collection = this.identityMap.findAll(hashes)[0]) {
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
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{"./../identity_map":25}],21:[function(require,module,exports){
(function() {
  module.exports = {
    unsync: function() {
      delete this.synced;
      return this.trigger("unsync", this);
    },
    didSync: function() {
      this.synced = Date.now();
      return this.trigger("synced", name, this);
    }
  };

}).call(this);

},{}],22:[function(require,module,exports){
(function() {
  var Graph, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Graph = (function(superClass) {
    extend(Graph, superClass);

    function Graph(json) {
      if (json == null) {
        json = {};
      }
      this.nodeTree = this.build(json);
    }

    Graph.prototype.build = function(json) {
      var graph, key, value;
      graph = {};
      for (key in json) {
        value = json[key];
        if (_.isArray(value) && _.isObject(value[0])) {
          graph[key] = this.build(value[0]);
        } else if (_.isObject(value)) {
          graph[key] = this.build(value);
        } else {
          graph[key] = void 0;
        }
      }
      return graph;
    };

    Graph.prototype.print = function(value) {
      var key, ref, result;
      result = "{";
      ref = value || this.nodeTree;
      for (key in ref) {
        value = ref[key];
        if (_.isArray(value) && _.isObject(value[0])) {
          result += " " + key + " " + (this.print(value[0]));
        } else if (_.isObject(value)) {
          result += " " + key + " " + (this.print(value));
        } else {
          result += " " + key;
        }
      }
      return result += " }";
    };

    Graph.prototype.parse = function(value) {
      value = value.split("{").splice(1).join("{");
      value = value.split("}").splice(value.split("}").length).join("}");
      return value;
    };

    Graph.prototype.contains = function(string) {};

    return Graph;

  })(Module);

}).call(this);

},{"./module":36}],23:[function(require,module,exports){
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
      fragment = this.getPathname();
      if (!_.isEmpty(parameters)) {
        fragment += "?" + ($.param(parameters));
      }
      return this.history.replaceState({}, document.title, fragment);
    };

    History.prototype.parameters = function() {
      var key, match, pair, parameters, regex, value;
      parameters = {};
      regex = /([^&=]+)=?([^&]*)/g;
      while (match = regex.exec(this.getSearch().substring(1))) {
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

    History.prototype.getPathname = function() {
      return "/" + (this.getPath().replace(this.getSearch(), ""));
    };

    History.register("History");

    return History;

  })(Backbone.History);

}).call(this);

},{"./module":36}],24:[function(require,module,exports){
(function() {
  var I18n, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = I18n = (function(superClass) {
    extend(I18n, superClass);

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

    I18n.register("I18n");

    return I18n;

  })(Module);

}).call(this);

},{"./module":36}],25:[function(require,module,exports){
(function() {
  var IdentityMap, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = IdentityMap = (function(superClass) {
    extend(IdentityMap, superClass);

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
          matches[key] = instance;
        }
      }
      return matches;
    };

    IdentityMap.prototype.find = function(key) {
      var value;
      if (value = this.instances[key]) {
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
      if (options == null) {
        options = {};
      }
      return this.instances[key] = value;
    };

    IdentityMap.prototype.storeAll = function(keys, value) {
      var i, key, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(this.store(key, value));
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

    IdentityMap.register("IdentityMap");

    return IdentityMap;

  })(Module);

}).call(this);

},{"./module":36}],26:[function(require,module,exports){
(function() {
  var Model, Module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Model = (function(superClass) {
    extend(Model, superClass);

    _.extend(Model, Module);

    Model.include(require("./model/syncs"));

    Model.include(require("./model/store"));

    Model.include(require("./model/schemes"));

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
      if (model = this.initializeStore(attributes, options)) {
        return model;
      }
      this.initializeSyncs();
      this.initializeSchemes();
      this.initializePopulate();
      this.initializeMappings();
      this.initializeValidations();
      this.initializeComputedAttributes();
      Model.__super__.constructor.apply(this, arguments);
      this.store();
      this.on("all", _.debounce((function(_this) {
        return function() {
          return _this.store();
        };
      })(this)));
    }

    Model.prototype.get = function(attribute) {
      if (this.mappings[attribute]) {
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
      this.setMappings(attributes, options);
      this.setNestedAttributes(attributes, options);
      Model.__super__.set.call(this, attributes, options);
      this.triggerNestedChange(options);
      return this;
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
        json = _.extend({
          cid: this.cid
        }, json, this.toJSONComputedAttributes(computedAttributes), this.toJSONMappings(mappings));
      }
      return json;
    };

    Model.prototype.parse = function(response) {
      var i, len, ref, schema;
      if (response == null) {
        response = {};
      }
      this.didSync();
      ref = this.validateSchemes(response);
      for (i = 0, len = ref.length; i < len; i++) {
        schema = ref[i];
        this.didSync(schema);
      }
      return response;
    };

    Model.register("Model");

    return Model;

  })(Backbone.Model);

}).call(this);

},{"./model/computed_attributes":27,"./model/mappings":28,"./model/nested_attributes":29,"./model/populate":30,"./model/schemes":31,"./model/store":32,"./model/syncs":34,"./model/validations":35,"./module":36}],27:[function(require,module,exports){
(function() {
  module.exports = {
    initializeComputedAttributes: function() {
      return this.computedAttributes || (this.computedAttributes = {});
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
      if (computedAttributes == null) {
        computedAttributes = [];
      }
      json = {};
      for (i = 0, len = computedAttributes.length; i < len; i++) {
        computedAttribute = computedAttributes[i];
        json[computedAttribute] = this.getComputedAttribute(computedAttribute);
      }
      return json;
    }
  };

}).call(this);

},{}],28:[function(require,module,exports){
(function() {
  module.exports = {
    initializeMappings: function() {
      this.transients = {};
      return this.mappings || (this.mappings = {});
    },
    mappingIdAttribute: function(mapping) {
      return mapping + "_" + (this.parseMappingIdAttribute(mapping));
    },
    mappingTypeAttribute: function(mapping) {
      return mapping + "_" + (this.parseMappingTypeAttribute(mapping));
    },
    mappingId: function(mapping, attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.mappingIdAttribute(mapping)];
    },
    mappingType: function(mapping, attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.mappingTypeAttribute(mapping)];
    },
    parseMappingIdAttribute: function(mapping) {
      return "id";
    },
    parseMappingTypeAttribute: function(mapping) {
      return "type";
    },
    parseMappingId: function(mapping, attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.parseMappingIdAttribute(mapping)];
    },
    parseMappingType: function(mapping, attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes[this.parseMappingTypeAttribute(mapping)];
    },
    getMapping: function(mapping) {
      var Model, Models, Module, attributes, collection, i, id, len, model, polymorphic;
      Module = this.mappings[mapping].apply(this);
      if (polymorphic = _.isArray(Module)) {
        Models = Module;
        for (i = 0, len = Models.length; i < len; i++) {
          Model = Models[i];
          if (Model.prototype.moduleName === this.mappingType(mapping, this.attributes)) {
            Module = Model;
          }
        }
      }
      if (Module.prototype instanceof require("./../model")) {
        attributes = {};
        if (id = this.mappingId(mapping, this.attributes)) {
          attributes[this.parseMappingIdAttribute(mapping)] = id;
        }
        if (!_.isEmpty(attributes)) {
          model = new Module(attributes);
        }
      } else if (Module.prototype instanceof require("./../collection")) {
        collection = new Module({
          parent: this
        });
      }
      return model || collection || this.transients[mapping];
    },
    setMapping: function(mapping, value, options) {
      var Model, Models, Module, collection, i, len, meta, model, models, polymorphic;
      if (options == null) {
        options = {};
      }
      Module = this.mappings[mapping].apply(this);
      if (polymorphic = _.isArray(Module) && value) {
        Models = Module;
        for (i = 0, len = Models.length; i < len; i++) {
          Model = Models[i];
          if (Model.prototype.moduleName === this.parseMappingType(mapping, value)) {
            Module = Model;
          }
        }
      }
      if (value instanceof require("./../model")) {
        model = value;
      } else if (value instanceof require("./../collection")) {
        collection = value;
        collection.setParent(this);
      }
      if (!model && !collection) {
        if (Module.prototype instanceof require("./../model") && value) {
          delete value[this.parseMappingTypeAttribute(mapping)];
          model = new Module(value, options);
        } else if (Module.prototype instanceof require("./../collection")) {
          if (_.isArray(value)) {
            models = value;
          } else if (_.isObject(value)) {
            meta = value.meta;
            models = value.models;
          }
          collection = new Module(models, _.extend(options, {
            parent: this,
            meta: meta
          }));
        }
      }
      if (model) {
        this.set(this.mappingIdAttribute(mapping), this.parseMappingId(mapping, model.attributes));
        if (polymorphic) {
          this.set(this.mappingTypeAttribute(mapping), model.moduleName);
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
      ref = _.pick(attributes, _.keys(this.mappings));
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
    toJSONMappings: function(mappings) {
      var json, mapping, options, ref;
      if (mappings == null) {
        mappings = {};
      }
      json = {};
      for (mapping in mappings) {
        options = mappings[mapping];
        json[mapping] = (ref = this.getMapping(mapping)) != null ? ref.toJSON(options) : void 0;
      }
      return json;
    }
  };

}).call(this);

},{"./../collection":13,"./../model":26}],29:[function(require,module,exports){
(function() {
  module.exports = {
    getNestedAttribute: function(attribute) {
      return _.path(this.attributes, attribute);
    },
    setNestedAttribute: function(attribute, value, options) {
      var i, len, nestedAttributes, path, paths, previousAttribute, ref, results;
      if (options == null) {
        options = {};
      }
      paths = attribute.split(".");
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
    triggerNestedChange: function(options) {
      if (_.keys(this.changed).length === 0 && _.keys(this.nestedChanged).length !== 0) {
        return this.trigger('change', this, options);
      }
    }
  };

}).call(this);

},{}],30:[function(require,module,exports){
(function() {
  module.exports = {
    initializePopulate: function() {
      return this.deferreds = {};
    },
    populated: function(name) {
      if (name) {
        return this.syncs[name];
      } else {
        return this.synced;
      }
    },
    populate: function(name) {
      return this.fetch();
    },
    prepare: function(name) {
      var deferred;
      deferred = this.deferreds[name];
      if (deferred && !deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);

},{}],31:[function(require,module,exports){
(function() {
  module.exports = {
    initializeSchemes: function() {
      return this.schemes || (this.schemes = {});
    },
    validateSchemes: function(attributes) {
      var name, ref, schema, valid;
      if (attributes == null) {
        attributes = {};
      }
      valid = [];
      ref = this.schemes;
      for (name in ref) {
        schema = ref[name];
        if (schema.apply(this, [attributes])) {
          valid.push(name);
        }
      }
      return valid;
    }
  };

}).call(this);

},{}],32:[function(require,module,exports){
(function() {
  var IdentityMap;

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = _.string.dasherize(this.prototype.moduleName).substring(1);
    },
    initializeStore: function(attributes, options) {
      var hashes, model;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = this.hashes(attributes);
      if (model = this.identityMap.findAll(hashes)[0]) {
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
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{"./../identity_map":25}],33:[function(require,module,exports){
(function() {
  module.exports = {
    initializeSync: function() {
      return this.syncs || (this.syncs = {});
    },
    unsync: function(name) {
      delete this.synced;
      delete this.syncs[name];
      if (name) {
        this.trigger("unsync:" + name, this);
      }
      return this.trigger("unsync", this);
    },
    didSync: function(name) {
      this.synced = Date.now();
      if (name) {
        this.syncs[name] = this.synced;
      }
      if (name) {
        this.trigger("synced:" + name, this);
      }
      return this.trigger("synced", name, this);
    }
  };

}).call(this);

},{}],34:[function(require,module,exports){
(function() {
  module.exports = {
    initializeSyncs: function() {
      return this.syncs || (this.syncs = {});
    },
    unsync: function(name) {
      if (name) {
        delete this.syncs[name];
        return this.trigger("unsync:" + name, this);
      } else {
        delete this.synced;
        return this.trigger("unsync", this);
      }
    },
    didSync: function(name) {
      if (name) {
        this.syncs[name] = this.synced;
        return this.trigger("synced:" + name, this);
      } else {
        this.synced = Date.now();
        return this.trigger("synced", name, this);
      }
    }
  };

}).call(this);

},{}],35:[function(require,module,exports){
(function() {
  module.exports = {
    initializeValidations: function() {
      this.errors = [];
      return this.validations || (this.validations = {});
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

},{}],36:[function(require,module,exports){
(function() {
  var Module, keywords, prepare, store,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  store = {};

  keywords = ['included', 'extended'];

  prepare = function(module) {
    var cid, superclass;
    superclass = module.__super__.constructor;
    cid = _.uniqueId("module");
    store[cid] = module;
    module.cid = cid;
    module.subclasses = [];
    module.includedModules = _.clone(superclass.includedModules || []);
    module.extendedModules = _.clone(superclass.extendedModules || []);
    if (superclass.subclasses) {
      return superclass.subclasses.push(module);
    }
  };

  module.exports = Module = (function() {
    function Module() {}

    Module.prototype.moduleName = "Module";

    Module.register = function(name) {
      var i, j, len, len1, module, ref, ref1, results;
      if (store[this.cid] !== this) {
        prepare(this);
      }
      this.prototype.moduleName = name;
      ref = this.includedModules;
      for (i = 0, len = ref.length; i < len; i++) {
        module = ref[i];
        if (module.registered) {
          module.registered.apply(this);
        }
      }
      ref1 = this.extendedModules;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        module = ref1[j];
        if (module.registered) {
          results.push(module.registered.apply(this));
        }
      }
      return results;
    };

    Module.include = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (store[this.cid] !== this) {
        prepare(this);
      }
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        this.includedModules.push(module);
        for (name in module) {
          method = module[name];
          if (indexOf.call(keywords, name) < 0) {
            this.prototype[name] = method;
          }
        }
        if (module.included) {
          module.included.apply(this);
        }
        if (module.registered) {
          results.push(module.registered.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.extend = function() {
      var i, len, method, module, modules, name, results;
      modules = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (store[this.cid] !== this) {
        prepare(this);
      }
      results = [];
      for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        this.extendedModules.push(module);
        for (name in module) {
          method = module[name];
          if (indexOf.call(keywords, name) < 0) {
            this[name] = method;
          }
        }
        if (module.extended) {
          module.extended.apply(this);
        }
        if (module.registered) {
          results.push(module.registered.apply(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Module.define = Backbone.Model.extend;

    return Module;

  })();

}).call(this);

},{}],37:[function(require,module,exports){
(function() {
  var Module, Route,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Route = (function(superClass) {
    extend(Route, superClass);

    Route.include(Backbone.Events);

    Route.include(require("./route/store"));

    Route.include(require("./route/title"));

    Route.include(require("./route/element"));

    Route.include(require("./route/populate"));

    Route.include(require("./route/activate"));

    Route.include(require("./route/parameters"));

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
      this.store();
      this.on("all", _.debounce((function(_this) {
        return function() {
          return _this.store();
        };
      })(this)));
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

},{"./module":36,"./route/activate":38,"./route/element":39,"./route/parameters":40,"./route/populate":41,"./route/store":42,"./route/title":43}],38:[function(require,module,exports){
(function() {
  module.exports = {
    active: function() {},
    beforeActivate: function() {
      return true;
    },
    activate: function() {
      if (this.beforeActivate() !== false) {
        return this.prepare().done((function(_this) {
          return function() {
            _this.active();
            _this.trigger("active");
            _this.renderTitle();
            return _this.renderElement();
          };
        })(this));
      }
    }
  };

}).call(this);

},{}],39:[function(require,module,exports){
(function() {
  var currentElement;

  currentElement = void 0;

  module.exports = {
    initializeElement: function(elementRoot) {
      return this.elementRoot || (this.elementRoot = elementRoot || document.body);
    },
    element: function() {},
    renderElement: function() {
      this._element || (this._element = this.element());
      if (currentElement !== this._element) {
        $(currentElement).detach();
        if (this.elementRoot.hipboneView) {
          this.elementRoot.hipboneView.setContent(this._element);
        } else {
          $(this.elementRoot).append(this._element);
        }
        return currentElement = this._element;
      }
    }
  };

}).call(this);

},{}],40:[function(require,module,exports){
(function() {
  var Model;

  Model = require("./../model");

  module.exports = {
    initializeParameters: function(params) {
      if (params == null) {
        params = {};
      }
      this.parse = _.bind(this.parse, this);
      this.params = this.parameters = new (Model.define({
        defaults: this.defaults,
        parse: this.parse
      }))(params, {
        parse: true
      });
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
    parse: function(response) {
      if (response == null) {
        response = {};
      }
      return response;
    }
  };

}).call(this);

},{"./../model":26}],41:[function(require,module,exports){
(function() {
  module.exports = {
    initializePopulate: function() {
      return this.deferreds = {};
    },
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      var deferred;
      deferred = this.deferreds[name];
      if (deferred && !deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);

},{}],42:[function(require,module,exports){
(function() {
  var IdentityMap;

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = _.string.dasherize(this.prototype.moduleName).substring(1);
    },
    initializeStore: function(params, options) {
      var hashes, route;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = this.hashes(params, options);
      if (this.identityMap.find(options.path) && !options.popstate) {
        hashes = _.without(hashes, options.path);
      }
      if (route = this.identityMap.findAll(hashes)[0]) {
        route.set(route.parse(params));
        return route;
      } else {
        this.store(hashes);
        return null;
      }
    },
    hashes: function(params, options) {
      var hashes;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      hashes.push(options.path);
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.params.attributes));
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{"./../identity_map":25}],43:[function(require,module,exports){
(function() {
  module.exports = {
    initializeTitle: function(titleRoot) {
      if (titleRoot == null) {
        titleRoot = "";
      }
      return this.titleRoot || (this.titleRoot = titleRoot);
    },
    subtitle: function() {
      return "";
    },
    title: function() {
      var subtitle;
      subtitle = this.subtitle();
      if (_.string.isBlank(subtitle)) {
        return this.titleRoot;
      } else {
        return subtitle + " - " + this.titleRoot;
      }
    },
    renderTitle: function() {
      return document.title = this.title();
    }
  };

}).call(this);

},{}],44:[function(require,module,exports){
(function() {
  var History, Module, Router,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  History = require("./history");

  module.exports = Router = (function(superClass) {
    extend(Router, superClass);

    _.extend(Router, Module);

    Router.include(require("./router/url"));

    Router.include(require("./router/matches"));

    Router.prototype.history = Backbone.history = new History;

    function Router(options) {
      if (options == null) {
        options = {};
      }
      this.initializeMatches();
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.navigate = function(fragment, options) {
      if (options == null) {
        options = {};
      }
      fragment = this.urlFragment(fragment, options.params);
      if (options.reload) {
        return this.history.reload(fragment);
      } else if (options.load) {
        return this.history.loadUrl(fragment);
      } else {
        return Router.__super__.navigate.call(this, fragment, options);
      }
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

},{"./history":23,"./module":36,"./router/matches":45,"./router/url":46}],45:[function(require,module,exports){
(function() {
  module.exports = {
    initializeMatches: function() {
      this.params || (this.params = {});
      return this.matches || (this.matches = {});
    },
    match: function(name, options) {
      var Route, url;
      if (options == null) {
        options = {};
      }
      this.matches[name] = options;
      url = options.url;
      Route = options.route;
      return this.route(url, name, function() {
        var i, index, len, param, ref;
        this.params = this.history.parameters();
        ref = url.match(/:\w+/g) || [];
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          param = ref[index];
          if (arguments[index]) {
            this.params[param.substring(1)] = _.parse(arguments[index]);
          }
        }
        this._route = new Route(this.params, {
          path: this.history.getPathname(),
          popstate: this.history.popstate
        });
        return this._route.activate();
      });
    }
  };

}).call(this);

},{}],46:[function(require,module,exports){
(function() {
  module.exports = {
    url: function(name, params) {
      if (params == null) {
        params = {};
      }
      return this.matches[name].toURL(params);
    },
    urlFragment: function(fragment, params) {
      var anchor;
      if (params == null) {
        params = {};
      }
      if (this.matches[fragment]) {
        fragment = this.url(fragment, params);
      }
      anchor = $("<a>").attr("href", fragment).get(0);
      if (params) {
        anchor.search = $.param(params);
      }
      fragment = anchor.pathname + anchor.search;
      return fragment;
    }
  };

}).call(this);

},{}],47:[function(require,module,exports){
(function() {
  var Module, Storage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = Storage = (function(superClass) {
    extend(Storage, superClass);

    function Storage(prefix) {
      if (prefix == null) {
        prefix = "hipbone_";
      }
      this.prefix = prefix;
    }

    Storage.prototype.match = function(regex) {
      var key, matches, value;
      matches = {};
      for (key in localStorage) {
        value = localStorage[key];
        if (regex.test(key)) {
          matches[key.replace(this.prefix, "")] = JSON.parse(value);
        }
      }
      return matches;
    };

    Storage.prototype.get = function(key) {
      var value;
      if (value = localStorage["" + this.prefix + key]) {
        return _.parse(value);
      }
    };

    Storage.prototype.set = function(key, value) {
      return localStorage.setItem("" + this.prefix + key, JSON.stringify(value));
    };

    Storage.prototype.unset = function(key) {
      return localStorage.removeItem("" + this.prefix + key);
    };

    Storage.prototype.clear = function() {
      var key, ref, regex, results, value;
      regex = new RegExp(this.prefix);
      ref = this.match(regex);
      results = [];
      for (key in ref) {
        value = ref[key];
        results.push(this.unset(key));
      }
      return results;
    };

    Storage.register("Storage");

    return Storage;

  })(Module);

}).call(this);

},{"./module":36}],48:[function(require,module,exports){
(function() {
  var Module, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Module = require("./module");

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    _.extend(View, Module);

    View.include(Backbone.Events);

    View.include(require("./view/store"));

    View.include(require("./view/bubble"));

    View.include(require("./view/content"));

    View.include(require("./view/context"));

    View.include(require("./view/populate"));

    View.include(require("./view/elements"));

    View.include(require("./view/template"));

    View.include(require("./view/lifecycle"));

    View.include(require("./view/properties"));

    View.include(require("./view/class_name_bindings"));

    function View(properties, options) {
      var view;
      if (properties == null) {
        properties = {};
      }
      if (options == null) {
        options = {};
      }
      if (view = this.initializeStore(properties)) {
        return view;
      }
      this.initializeContext();
      this.initializeContent(options.content);
      this.initializePopulate();
      this.initializeTemplate();
      this.initializeElements();
      this.initializeProperties(properties);
      this.initializeClassNameBindings();
      View.__super__.constructor.call(this, options);
      this.store();
      this.lifecycle();
      this.prepare();
      this.render();
      this.on("all", _.debounce((function(_this) {
        return function() {
          return _this.store();
        };
      })(this)));
      this.on("change", _.debounce((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
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

},{"./module":36,"./view/bubble":49,"./view/class_name_bindings":50,"./view/content":51,"./view/context":52,"./view/elements":53,"./view/lifecycle":54,"./view/populate":55,"./view/properties":56,"./view/store":57,"./view/template":58}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
(function() {
  module.exports = {
    initializeContent: function(content) {
      this.content = content;
      return this.container || (this.container = void 0);
    },
    setContent: function(content) {
      if (this.content !== content) {
        $(this.content).detach();
        this.content = content;
        return this.renderContent();
      }
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

},{}],52:[function(require,module,exports){
(function() {
  var Collection, Model;

  Model = require("./../model");

  Collection = require("./../collection");

  module.exports = {
    initializeContext: function() {
      return this._context = {};
    },
    context: function() {
      return {};
    },
    getContext: function(context, rootContext) {
      if (context == null) {
        context = {};
      }
      rootContext || (rootContext = this._context);
      context = _.isEmpty(context) ? rootContext : context;
      context.cid = this.cid;
      return context;
    },
    presentContext: function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      context.cid = this.cid;
      ref = context = _.defaults(context, this.properties.attributes);
      for (key in ref) {
        value = ref[key];
        if (value instanceof Model || value instanceof Collection) {
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
    updateContextBindings: function() {
      this.mergeContext(this.presentContext(this.context()));
      return Platform.performMicrotaskCheckpoint();
    }
  };

}).call(this);

},{"./../collection":13,"./../model":26}],53:[function(require,module,exports){
(function() {
  var findBooleans;

  findBooleans = function(attributes, internals) {
    var booleans, key, value;
    if (attributes == null) {
      attributes = {};
    }
    if (internals == null) {
      internals = [];
    }
    booleans = [];
    for (key in attributes) {
      value = attributes[key];
      if (_.isBoolean(value) && !_.contains(internals, key)) {
        booleans.push(_.string.dasherize(key));
      }
    }
    return booleans;
  };

  module.exports = {
    registered: function() {
      var View;
      this.prototype.elementName = _.string.dasherize(this.prototype.moduleName).substring(1).replace("-view", "");
      this.prototype.booleans = findBooleans(this.prototype.defaults, this.prototype.internals);
      View = this;
      return Handlebars.registerElement(this.prototype.elementName, function(attributes) {
        return new View(attributes, {
          content: $(this).contents()
        }).el;
      }, {
        booleans: this.prototype.booleans
      });
    },
    initializeElements: function() {
      this.elementName || (this.elementName = "");
      this.elements || (this.elements = {});
      return this.booleans || (this.booleans = []);
    },
    getSelector: function(selector) {
      return this.elements[selector] || selector;
    },
    defineElement: function() {
      this.el.hipboneView = this;
      return this.el;
    },
    $view: function(selector) {
      if (this.$(selector)[0]) {
        return this.$(selector)[0].hipboneView;
      }
    }
  };

}).call(this);

},{}],54:[function(require,module,exports){
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
            var property;
            _this.change(attribute, value);
            property = _.string.camelize(attribute);
            if (!_.contains(_this.internals, property)) {
              return _this.set(property, Handlebars.parseValue(value, _.contains(_this.booleans, attribute)));
            }
          };
        })(this)
      });
    }
  };

}).call(this);

},{}],55:[function(require,module,exports){
(function() {
  module.exports = {
    initializePopulate: function() {
      this.deferreds = {};
      this.background || (this.background = false);
      this.defaults || (this.defaults = {});
      this.defaults.loading = false;
      this.internals || (this.internals = []);
      return this.internals.push("loading");
    },
    populated: function(name) {
      return false;
    },
    populate: function(name) {
      return $.when(true);
    },
    prepare: function(name) {
      var deferred, populated;
      deferred = this.deferreds[name];
      if (deferred && deferred.state() !== "resolved") {
        return deferred;
      } else {
        populated = this.populated(name);
        if (!populated) {
          this.set({
            loading: true
          });
        }
        if (this.background) {
          populated = false;
        }
        return this.deferreds[name] = $.when(populated || this.populate(name)).done((function(_this) {
          return function() {
            return _this.set({
              loading: false
            });
          };
        })(this));
      }
    }
  };

}).call(this);

},{}],56:[function(require,module,exports){
(function() {
  var Model;

  Model = require("./../model");

  module.exports = {
    initializeProperties: function(properties) {
      if (properties == null) {
        properties = {};
      }
      this.internals || (this.internals = []);
      this.props = this.properties = new (Model.define({
        defaults: this.defaults
      }))(_.omit(properties, this.internals));
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
    },
    mergeAttributes: function(attributes) {
      var attribute, ref, value;
      if (attributes == null) {
        attributes = {};
      }
      ref = this.properties.attributes;
      for (attribute in ref) {
        value = ref[attribute];
        if (!(!_.contains(this.internals, attribute))) {
          continue;
        }
        attribute = _.string.dasherize(attribute);
        if (attribute === "class") {
          attributes[attribute] = (attributes[attribute] + " " + value).trim();
        } else if (_.contains(this.booleans, attribute)) {
          if (value) {
            attributes[attribute] = '';
          }
        } else if (!_.isObject(value)) {
          attributes[attribute] = value;
        }
      }
      return attributes;
    }
  };

}).call(this);

},{"./../model":26}],57:[function(require,module,exports){
(function() {
  var IdentityMap;

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = _.string.dasherize(this.prototype.moduleName).substring(1);
    },
    initializeStore: function(properties) {
      var hashes, view;
      if (properties == null) {
        properties = {};
      }
      hashes = this.hashes(properties);
      if (view = this.identityMap.findAll(hashes)[0]) {
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
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{"./../identity_map":25}],58:[function(require,module,exports){
(function() {
  module.exports = {
    initializeTemplate: function() {
      this.templates || (this.templates = {});
      this.templatePath || (this.templatePath = "");
      return this.templateName || (this.templateName = "");
    },
    template: function(path, context) {
      return $(Handlebars.parseHTML(this.getTemplate(path)(this.getContext(context))));
    },
    getTemplate: function(path) {
      return this.templates["" + this.templatePath + path];
    },
    renderTemplate: function() {
      if (this.templateName) {
        return this.$el.html(this.template(this.templateName));
      }
    }
  };

}).call(this);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58]);
