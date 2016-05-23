// hipbone
// ------------------
// v2.0.1
//
// Copyright (c) 2012-2016 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/hipbone


require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Backbone, _,
    slice = [].slice;

  Backbone = require("backbone");

  _ = require("underscore");

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

},{"backbone":58,"underscore":"underscore"}],2:[function(require,module,exports){
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

},{"./../module":35,"./../router":43,"./../storage":47,"./ajax":1,"./initializers":3,"./locale":10,"./state":11,"backbone":58}],3:[function(require,module,exports){
(function() {
  module.exports = {
    initializeInitializers: function() {
      this.initializers || (this.initializers = []);
      this.initializers.unshift(require("./parse_body"));
      this.initializers.unshift(require("./parse_model"));
      this.initializers.unshift(require("./link_bridge"));
      this.initializers.unshift(require("./prevent_form"));
      this.initializers.unshift(require("./prepare_sync"));
      return this.initializers.unshift(require("./register_helpers"));
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

},{"./link_bridge":4,"./parse_body":5,"./parse_model":6,"./prepare_sync":7,"./prevent_form":8,"./register_helpers":9}],4:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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

},{"jquery":"jquery"}],5:[function(require,module,exports){
(function() {
  var Handlebars;

  Handlebars = require("handlebars");

  module.exports = function() {
    return this.on("run", function() {
      return Handlebars.parseHTML(document.body.childNodes);
    });
  };

}).call(this);

},{"handlebars":"handlebars"}],6:[function(require,module,exports){
(function() {
  var Collection, Handlebars, Model;

  Handlebars = require("handlebars");

  Model = require("./../../model");

  Collection = require("./../../collection");

  module.exports = function() {
    var parseValue;
    parseValue = Handlebars.parseValue;
    return Handlebars.parseValue = function(value, bool) {
      var model;
      value = parseValue.apply(this, [value, bool]);
      if (value && (model = Model.identityMap.find(value.cid) || Collection.identityMap.find(value.cid))) {
        value = model;
      }
      return value;
    };
  };

}).call(this);

},{"./../../collection":13,"./../../model":27,"handlebars":"handlebars"}],7:[function(require,module,exports){
(function() {
  var Backbone;

  Backbone = require("backbone");

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
        return _this.ajaxHandle(sync.apply(Backbone, [method, model, options]));
      };
    })(this);
  };

}).call(this);

},{"backbone":58}],8:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

  module.exports = function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  };

}).call(this);

},{"jquery":"jquery"}],9:[function(require,module,exports){
(function() {
  var Handlebars, View, _,
    slice = [].slice;

  _ = require("underscore");

  Handlebars = require("handlebars");

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
        return _this.router.matchUrl(name, options.hash);
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
    Handlebars.registerHelper('template', function(path, context, options) {
      var template;
      if (context == null) {
        context = {};
      }
      if (options == null) {
        options = {};
      }
      if (context.hash != null) {
        options = context;
        context = {};
      }
      context = _.extend({}, context, options.hash);
      template = this.view.getTemplate(path)(this.view.getContext(context, this));
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

},{"./../../view":53,"handlebars":"handlebars","underscore":"underscore"}],10:[function(require,module,exports){
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

},{"./../i18n":23}],11:[function(require,module,exports){
(function() {
  var Model;

  Model = require("./../model");

  module.exports = {
    initializeState: function(state) {
      if (state == null) {
        state = {};
      }
      this.state = new (Model.define({
        defaults: this.defaults,
        urlRoot: this.urlRoot,
        parse: this.parse
      }))(state);
      return this.listenTo(this.state, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
        };
      })(this));
    },
    fetch: function() {
      return this.state.fetch.apply(this.state, arguments);
    },
    parse: function(response) {
      return response;
    },
    get: function() {
      return this.state.get.apply(this.state, arguments);
    },
    set: function() {
      return this.state.set.apply(this.state, arguments);
    }
  };

}).call(this);

},{"./../model":27}],12:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],13:[function(require,module,exports){
(function() {
  var $, Backbone, Collection, Model, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  $ = require("jquery");

  _ = require("underscore");

  Backbone = require("backbone");

  Model = require("./../model");

  Module = require("./../module");

  module.exports = Collection = (function(superClass) {
    extend(Collection, superClass);

    _.extend(Collection, Module);

    Collection.include(require("./sync"));

    Collection.include(require("./meta"));

    Collection.include(require("./store"));

    Collection.include(require("./parent"));

    Collection.include(require("./filters"));

    Collection.include(require("./populate"));

    Collection.include(require("./pagination"));

    Collection.include(require("./polymorphic"));

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
      this.storeChanges();
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
      var url;
      url = this.parentUrl(options);
      if (!_.isEmpty(this.getFilters(options))) {
        url = url + "?" + ($.param(this.getFilters(options)));
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

},{"./../model":27,"./../module":35,"./filters":12,"./meta":14,"./pagination":15,"./parent":16,"./polymorphic":17,"./populate":18,"./store":19,"./sync":20,"backbone":58,"jquery":"jquery","underscore":"underscore"}],14:[function(require,module,exports){
(function() {
  var Model,
    slice = [].slice;

  Model = require("./../model");

  module.exports = {
    countAttribute: "count",
    initializeMeta: function(meta) {
      if (meta == null) {
        meta = {};
      }
      this.meta = new (Model.define({
        defaults: this.defaults,
        url: this.metaUrl,
        parse: this.metaParse
      }))(meta);
      this.listenTo(this.meta, "all", (function(_this) {
        return function() {
          var args, eventName;
          eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return _this.trigger.apply(_this, ["meta:" + eventName].concat(slice.call(args)));
        };
      })(this));
      this.on("add", this.incrementCounter);
      return this.on("remove", this.decrementCounter);
    },
    metaUrl: (function(_this) {
      return function() {
        return _this.url();
      };
    })(this),
    metaParse: function(response) {
      return response.meta;
    },
    incrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has(this.countAttribute) && !options.parse) {
        return this.meta.set(this.countAttribute, this.meta.get(this.countAttribute) + 1);
      }
    },
    decrementCounter: function(model, collection, options) {
      if (options == null) {
        options = {};
      }
      if (this.meta.has(this.countAttribute) && !options.parse) {
        return this.meta.set(this.countAttribute, this.meta.get(this.countAttribute) - 1);
      }
    }
  };

}).call(this);

},{"./../model":27}],15:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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
      return this.filters.offset = function(options) {
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
      return this.length < (this.meta.get(this.countAttribute) || 0);
    }
  };

}).call(this);

},{"underscore":"underscore"}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],18:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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
      if (deferred && deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);

},{"jquery":"jquery"}],19:[function(require,module,exports){
(function() {
  var IdentityMap, dasherize;

  dasherize = require("string-dasherize");

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = dasherize(this.prototype.moduleName || "").substring(1);
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
    storeChanges: function() {
      this.on("change change:parent meta:change", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      return this.store();
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

},{"./../identity_map":24,"string-dasherize":91}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./../module":35,"./query":22,"backbone":58,"underscore":"underscore"}],22:[function(require,module,exports){
(function() {
  var $, _;

  $ = require("jquery");

  _ = require("underscore");

  module.exports = {
    change: function(query) {
      var fragment, key, value;
      if (query == null) {
        query = {};
      }
      for (key in query) {
        value = query[key];
        if (value == null) {
          delete query[key];
        }
      }
      fragment = this.getPathname();
      if (!_.isEmpty(query)) {
        fragment += "?" + ($.param(query));
      }
      return this.history.replaceState({}, document.title, fragment);
    },
    getQuery: function() {
      var key, match, pair, query, regex, value;
      query = {};
      regex = /([^&=]+)=?([^&]*)/g;
      while (match = regex.exec(this.getSearch().substring(1))) {
        pair = match[0], key = match[1], value = match[2];
        query[this.decode(key)] = _.parse(this.decode(value));
      }
      return query;
    },
    decode: function(string) {
      return decodeURIComponent(string.replace(/\+/g, " "));
    }
  };

}).call(this);

},{"jquery":"jquery","underscore":"underscore"}],23:[function(require,module,exports){
(function() {
  var I18n, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Module = require("./../module");

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

},{"./../module":35,"underscore":"underscore"}],24:[function(require,module,exports){
(function() {
  var IdentityMap, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Module = require("./../module");

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

},{"./../module":35,"underscore":"underscore"}],25:[function(require,module,exports){
(function() {
  require("jquery.lifecycle");

  require("handlebars.binding");

  _.mixin(require("underscore.path"));

  _.mixin(require("underscore.pathextend"));

  _.mixin(require("underscore.parse"));

  _.mixin(require("underscore.prefilter"));

  _.mixin(require("underscore.catenate"));

  _.mixin(require("underscore.deepclone"));

  window.Hipbone = {
    VERSION: '2.0.1',
    I18n: require("./i18n"),
    View: require("./view"),
    Model: require("./model"),
    Route: require("./route"),
    Module: require("./module"),
    Router: require("./router"),
    History: require("./history"),
    Storage: require("./storage"),
    Collection: require("./collection"),
    Application: require("./application"),
    IdentityMap: require("./identity_map")
  };

}).call(this);

},{"./application":2,"./collection":13,"./history":21,"./i18n":23,"./identity_map":24,"./model":27,"./module":35,"./route":38,"./router":43,"./storage":47,"./view":53,"handlebars.binding":66,"jquery.lifecycle":73,"underscore.catenate":92,"underscore.deepclone":93,"underscore.parse":94,"underscore.path":95,"underscore.pathextend":96,"underscore.prefilter":97}],26:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],27:[function(require,module,exports){
(function() {
  var Backbone, Model, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  module.exports = Model = (function(superClass) {
    extend(Model, superClass);

    _.extend(Model, Module);

    Model.include(require("./syncs"));

    Model.include(require("./store"));

    Model.include(require("./schemes"));

    Model.include(require("./mappings"));

    Model.include(require("./populate"));

    Model.include(require("./validations"));

    Model.include(require("./nested_attributes"));

    Model.include(require("./computed_attributes"));

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
      this.storeChanges();
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

},{"./../module":35,"./computed_attributes":26,"./mappings":28,"./nested_attributes":29,"./populate":30,"./schemes":31,"./store":32,"./syncs":33,"./validations":34,"backbone":58,"underscore":"underscore"}],28:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"./../collection":13,"./../model":27,"underscore":"underscore"}],29:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],30:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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

},{"jquery":"jquery"}],31:[function(require,module,exports){
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
  var IdentityMap, dasherize;

  dasherize = require("string-dasherize");

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = dasherize(this.prototype.moduleName || "").substring(1);
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
    storeChanges: function() {
      this.on("change", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      return this.store();
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

},{"./../identity_map":24,"string-dasherize":91}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],35:[function(require,module,exports){
(function() {
  var Backbone, Module, _, keywords, prepare, store,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require("underscore");

  Backbone = require("backbone");

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

},{"backbone":58,"underscore":"underscore"}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
(function() {
  var $, currentElement;

  $ = require("jquery");

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

},{"jquery":"jquery"}],38:[function(require,module,exports){
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

},{"./../module":35,"./activate":36,"./element":37,"./parameters":39,"./populate":40,"./store":41,"./title":42,"backbone":58,"underscore":"underscore"}],39:[function(require,module,exports){
(function() {
  var Model, _;

  _ = require("underscore");

  Model = require("./../model/index");

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

},{"./../model/index":27,"underscore":"underscore"}],40:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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
      if (deferred && deferred.state() !== "resolved") {
        return deferred;
      } else {
        return this.deferreds[name] = $.when(this.populated(name) || this.populate(name));
      }
    }
  };

}).call(this);

},{"jquery":"jquery"}],41:[function(require,module,exports){
(function() {
  var IdentityMap, _, dasherize;

  _ = require("underscore");

  dasherize = require("string-dasherize");

  IdentityMap = require("./../identity_map");

  module.exports = {
    included: function() {
      var base;
      return this.identityMap = (base = this.prototype).identityMap || (base.identityMap = new IdentityMap);
    },
    registered: function() {
      return this.prototype.hashName = dasherize(this.prototype.moduleName || "").substring(1);
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
      if (this.identityMap.find(options.pathname) && !options.popstate) {
        hashes = _.without(hashes, options.pathname);
      }
      if (route = this.identityMap.findAll(hashes)[0]) {
        route.set(route.parse(params));
        return route;
      } else {
        this.store(hashes);
        return null;
      }
    },
    storeChanges: function() {
      this.on("change", (function(_this) {
        return function() {
          return _this.store();
        };
      })(this));
      return this.store();
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
      hashes.push(options.pathname);
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.params.attributes));
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);

},{"./../identity_map":24,"string-dasherize":91,"underscore":"underscore"}],42:[function(require,module,exports){
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
      if (subtitle.trim() === "") {
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

},{}],43:[function(require,module,exports){
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

},{"./../history":21,"./../module":35,"./matches":44,"./params":45,"./url":46,"backbone":58,"underscore":"underscore"}],44:[function(require,module,exports){
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

},{"underscore":"underscore"}],45:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

  module.exports = {
    initializeParams: function() {
      return this.params || (this.params = {});
    },
    updateParams: function(params) {
      if (params == null) {
        params = {};
      }
      return this.params = _.extend(this.history.getQuery(), params);
    }
  };

}).call(this);

},{"underscore":"underscore"}],46:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    url: function(fragment, params) {
      var anchor;
      if (params == null) {
        params = {};
      }
      anchor = $("<a>").attr("href", fragment).get(0);
      if (params) {
        if (anchor.search.trim() === "") {
          anchor.search += $.param(params);
        } else {
          anchor.search += "&" + ($.param(params));
        }
      }
      fragment = anchor.pathname + anchor.search;
      return fragment;
    }
  };

}).call(this);

},{"jquery":"jquery"}],47:[function(require,module,exports){
(function() {
  var Module, Storage, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Module = require("./../module");

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
        if (regex.test(key) && key.indexOf(this.prefix) >= 0) {
          matches[key.replace(this.prefix, "")] = _.parse(value).data;
        }
      }
      return matches;
    };

    Storage.prototype.get = function(key) {
      var value;
      if (value = localStorage["" + this.prefix + key]) {
        return _.parse(value).data;
      }
    };

    Storage.prototype.set = function(key, value) {
      return localStorage.setItem("" + this.prefix + key, JSON.stringify({
        data: value,
        timestamp: _.now()
      }));
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

},{"./../module":35,"underscore":"underscore"}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
(function() {
  var _;

  _ = require("underscore");

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

},{"underscore":"underscore"}],50:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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

},{"jquery":"jquery"}],51:[function(require,module,exports){
(function() {
  var Collection, Handlebars, Model, _, diffPatcher, jsondiffpatch;

  _ = require("underscore");

  Handlebars = require("handlebars");

  jsondiffpatch = require("jsondiffpatch");

  Model = require("./../model");

  Collection = require("./../collection");

  diffPatcher = jsondiffpatch.create({
    objectHash: function(object) {
      return (object != null ? object.cid : void 0) || object;
    }
  });

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
      context.view = this;
      return context;
    },
    presentContext: function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      context.view = this;
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
      return diffPatcher.patch(this._context, diffPatcher.diff(this._context, context));
    },
    updateContextBindings: function() {
      this.mergeContext(this.presentContext(this.context()));
      return Handlebars.update();
    }
  };

}).call(this);

},{"./../collection":13,"./../model":27,"handlebars":"handlebars","jsondiffpatch":87,"underscore":"underscore"}],52:[function(require,module,exports){
(function() {
  var $, Handlebars, _, dasherize, findBooleans;

  $ = require("jquery");

  _ = require("underscore");

  Handlebars = require("handlebars");

  dasherize = require("string-dasherize");

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
        booleans.push(key);
      }
    }
    return booleans;
  };

  module.exports = {
    registered: function() {
      var View;
      this.prototype.elementName = dasherize(this.prototype.moduleName || "").substring(1).replace("-view", "");
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

},{"handlebars":"handlebars","jquery":"jquery","string-dasherize":91,"underscore":"underscore"}],53:[function(require,module,exports){
(function() {
  var Backbone, Module, View, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Backbone = require("backbone");

  Module = require("./../module");

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    _.extend(View, Module);

    View.include(Backbone.Events);

    View.include(require("./bubble"));

    View.include(require("./content"));

    View.include(require("./context"));

    View.include(require("./populate"));

    View.include(require("./elements"));

    View.include(require("./template"));

    View.include(require("./lifecycle"));

    View.include(require("./properties"));

    View.include(require("./class_name_bindings"));

    function View(properties, options) {
      if (properties == null) {
        properties = {};
      }
      if (options == null) {
        options = {};
      }
      this.initializeContext();
      this.initializeContent(options.content);
      this.initializePopulate();
      this.initializeTemplate();
      this.initializeElements();
      this.initializeProperties(properties);
      this.initializeClassNameBindings();
      View.__super__.constructor.call(this, options);
      this.lifecycle();
      this.prepare();
      this.render();
      this.on("change", this.update);
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

},{"./../module":35,"./bubble":48,"./class_name_bindings":49,"./content":50,"./context":51,"./elements":52,"./lifecycle":54,"./populate":55,"./properties":56,"./template":57,"backbone":58,"underscore":"underscore"}],54:[function(require,module,exports){
(function() {
  var Handlebars, _, camelize;

  _ = require("underscore");

  Handlebars = require("handlebars");

  camelize = require("camelize");

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
            property = camelize(attribute);
            if (!_.contains(_this.internals, property)) {
              return _this.set(property, Handlebars.parseValue(value, _.contains(_this.booleans, property)));
            }
          };
        })(this)
      });
    }
  };

}).call(this);

},{"camelize":59,"handlebars":"handlebars","underscore":"underscore"}],55:[function(require,module,exports){
(function() {
  var $;

  $ = require("jquery");

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

},{"jquery":"jquery"}],56:[function(require,module,exports){
(function() {
  var Model, _, dasherize;

  _ = require("underscore");

  dasherize = require("string-dasherize");

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
      return this.listenTo(this.props, "all", (function(_this) {
        return function() {
          return _this.trigger.apply(_this, arguments);
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
        attribute = dasherize(attribute || "");
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

},{"./../model":27,"string-dasherize":91,"underscore":"underscore"}],57:[function(require,module,exports){
(function() {
  var $, Handlebars;

  $ = require("jquery");

  Handlebars = require("handlebars");

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
      Handlebars.unbind(this.el);
      if (this.templateName) {
        return this.$el.html(this.template(this.templateName));
      }
    }
  };

}).call(this);

},{"handlebars":"handlebars","jquery":"jquery"}],58:[function(require,module,exports){
(function (global){
//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to a common array method we'll want to use later.
  var slice = Array.prototype.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.3.3';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Proxy Backbone class methods to Underscore functions, wrapping the model's
  // `attributes` object or collection's `models` array behind the scenes.
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply` can be slow so we use the method's arg count, if we know it.
  var addMethod = function(length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return _[method](this[attribute]);
      };
      case 2: return function(value) {
        return _[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return _[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return _[method].apply(_, args);
      };
    }
  };
  var addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
    });
  };

  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    return internalOn(this, name, callback, context);
  };

  // Guard the `listening` argument from the public API.
  var internalOn = function(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }

    return obj;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
    }

    // Bind callbacks on obj, and keep track of them on listening.
    internalOn(obj, name, callback, this, listening);
    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });
    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var i = 0, listening;
    var context = options.context, listeners = options.listeners;

    // Delete all events listeners and "drop" events.
    if (!name && !callback && !context) {
      var ids = _.keys(listeners);
      for (; i < ids.length; i++) {
        listening = listeners[ids[i]];
        delete listeners[listening.id];
        delete listening.listeningTo[listening.objId];
      }
      return;
    }

    var names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Replace events if there are any remaining.  Otherwise, clean up.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          listening = handler.listening;
          if (listening && --listening.count === 0) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.objId];
          }
        }
      }

      // Update tail event if the list has any events.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }
    return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Update the `id`.
      if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
      }
      return _.size(changed) ? changed : false;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // Set temporary attributes if `{wait: true}` to properly find new ids.
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // Restore attributes.
      this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model, mapped to the
  // number of arguments they take.
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1};

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  addUnderscoreMethods(Model, modelMethods, 'attributes');

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Splices `insert` into `array` at index `at`.
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set. `models` may be Backbone
    // Models or raw JavaScript objects to be converted to Models, or any
    // combination of the two.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // Remove stale models.
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort/update events.
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id, cid, model object with id or cid
    // properties, or an attributes object that is transformed through modelId.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(obj.attributes || obj)] ||
        obj.cid && this._byId[obj.cid];
    },

    // Returns `true` if the model is in the collection.
    has: function(obj) {
      return this.get(obj) != null;
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = _.bind(comparator, this);

      // Run sort based on type of `comparator`.
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function(attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set.
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // Remove references before triggering 'remove' event to prevent an
        // infinite loop. #3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function(model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
      foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
      contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
      isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
      sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};

  // Mix in each Underscore method as a proxy to `Collection#models`.
  addUnderscoreMethods(Collection, collectionMethods, 'models');

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be set as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = _.bind(this.checkUrl, this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Don't include a trailing slash on the root.
      var rootPath = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // Strip the hash and decode for matching.
      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function and add the prototype properties.
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":"jquery","underscore":"underscore"}],59:[function(require,module,exports){
module.exports = function(obj) {
    if (typeof obj === 'string') return camelCase(obj);
    return walk(obj);
};

function walk (obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (isDate(obj) || isRegex(obj)) return obj;
    if (isArray(obj)) return map(obj, walk);
    return reduce(objectKeys(obj), function (acc, key) {
        var camel = camelCase(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}

function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase();
    });
}

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}

function reduce (xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc);
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observeJs = require("observe-js");

var _utils = require("../utils");

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

var _core = require("../core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Binding = function () {
  function Binding(context, keypath, value, options) {
    _classCallCheck(this, Binding);

    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.id = (0, _deps.getUtils)().uniqueId();
    this.value = value;
    this.context = context;
    this.keypath = keypath;
    this.options = options;
    if (keypath) this.value = (0, _utils.path)(this.context, this.keypath);
  }

  _createClass(Binding, [{
    key: "setNode",
    value: function setNode(node) {
      node.bindings = node.bindings || [];
      node.bindings.push(this);
      return this.node = node;
    }
  }, {
    key: "setMarker",
    value: function setMarker(marker) {
      marker.binding = this;
      return this.marker = marker;
    }
  }, {
    key: "setDelimiter",
    value: function setDelimiter(delimiter) {
      return this.delimiter = delimiter;
    }
  }, {
    key: "setOutput",
    value: function setOutput(output) {
      this.previousOutput = this.output;
      return this.output = output;
    }
  }, {
    key: "setObserver",
    value: function setObserver(observer) {
      return this.observer = observer;
    }
  }, {
    key: "createElement",
    value: function createElement() {
      return "<hb-binding id=\"" + this.id + "\"></hb-binding>";
    }
  }, {
    key: "createAttribute",
    value: function createAttribute() {
      return "hb-binding-" + this.id;
    }
  }, {
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.attr) {
        return this.initializeAttribute();
      } else if (!this.options.fn) {
        return this.initializeInline();
      } else {
        return this.initializeBlock();
      }
    }
  }, {
    key: "initializeAttribute",
    value: function initializeAttribute(node) {
      var _this = this;

      var attributeName = "binding-" + this.id;

      _deps2.default.Handlebars.registerAttribute(attributeName, function (node) {
        return null;
      }, {
        ready: function ready(node) {
          _this.setNode(node);
          _this.render({ initialize: true });
          _this.observe();
          delete _deps2.default.Handlebars.attributes[attributeName];
        }
      });

      return this.createAttribute();
    }
  }, {
    key: "initializeInline",
    value: function initializeInline() {
      this.setNode(document.createTextNode(""));
      this.render({ initialize: true });
      this.observe();
      _deps2.default.Handlebars.store.hold(this.id, (0, _deps.getUtils)().flatten([this.node]));
      return new _deps2.default.Handlebars.SafeString(this.createElement());
    }
  }, {
    key: "initializeBlock",
    value: function initializeBlock() {
      this.setMarker(document.createTextNode(""));
      this.setDelimiter(document.createTextNode(""));
      var nodes = this.render({ initialize: true });
      this.observe();
      _deps2.default.Handlebars.store.hold(this.id, (0, _deps.getUtils)().flatten([this.marker, nodes, this.delimiter]));
      return new _deps2.default.Handlebars.SafeString(this.createElement());
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.options.fn) {
        this.setOutput(this.options.fn(this.context));
      } else {
        this.setOutput(this.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.runOutput();

      if (this.options.hash.attr) {
        return this.renderAttribute(options);
      } else if (!this.options.fn) {
        return this.renderInline(options);
      } else {
        return this.renderBlock(options);
      }
    }
  }, {
    key: "renderAttribute",
    value: function renderAttribute() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.options.hash.attr == true) {
        if (this.previousOutput != this.output) {
          this.node.removeAttribute(this.previousOutput);
          this.node.setAttribute(this.output, "");
        }
      } else if (this.options.hash.attr == "class") {
        (0, _utils.removeClass)(this.node, this.previousOutput);
        (0, _utils.addClass)(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }, {
    key: "renderInline",
    value: function renderInline() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if ((0, _deps.getUtils)().isString(this.output)) {
        this.node.textContent = (0, _deps.getUtils)().escapeExpression(new _deps2.default.Handlebars.SafeString(this.output));
      } else {
        this.node.textContent = (0, _deps.getUtils)().escapeExpression(this.output);
      }
    }
  }, {
    key: "renderBlock",
    value: function renderBlock() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.initialize) {
        return _deps2.default.Handlebars.parseHTML(this.output); // gambi
      } else {
          (0, _utils.removeBetween)(this.marker, this.delimiter).forEach(function (node) {
            return (0, _core.unbind)(node);
          });
          (0, _deps.getUtils)().insertAfter(this.marker, _deps2.default.Handlebars.parseHTML(this.output));
        }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      if ((0, _deps.getUtils)().isArray(this.value)) {
        this.setObserver(new _observeJs.ArrayObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else if ((0, _deps.getUtils)().isObject(this.value)) {
        this.setObserver(new _observeJs.ObjectObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else {
        this.setObserver(new _observeJs.PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this2.value = value;
          _this2.render();
        });
      }
    }
  }, {
    key: "stopObserving",
    value: function stopObserving() {
      if (this.observer) {
        this.observer.close();
      }
    }
  }]);

  return Binding;
}();

exports.default = Binding;

},{"../core":64,"../deps":65,"../utils":67,"observe-js":90}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

var _utils = require("../utils");

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

var _core = require("../core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemBinding = function (_Binding) {
  _inherits(ItemBinding, _Binding);

  function ItemBinding() {
    _classCallCheck(this, ItemBinding);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ItemBinding).apply(this, arguments));
  }

  _createClass(ItemBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(ItemBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.options.hash.var) {
        this.context[this.options.hash.var] = this.value;
      } else if ((0, _deps.getUtils)().isObject(this.value)) {
        (0, _deps.getUtils)().extend(this.context, this.value);
      }

      return this.setOutput(this.options.fn(this.context));
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      this.parentContextObserver = new _observeJs.ObjectObserver(this.options.hash.parentContext);
      this.parentContextObserver.open(function () {
        (0, _deps.getUtils)().extend(_this2.context, _this2.options.hash.parentContext);
      });

      if ((0, _deps.getUtils)().isObject(this.value)) {
        if (!this.options.hash.var) {
          this.setObserver(new _observeJs.ObjectObserver(this.value));
          this.observer.open(function () {
            return (0, _deps.getUtils)().extend(_this2.context, _this2.value);
          });
        }
      }
    }
  }]);

  return ItemBinding;
}(_binding2.default);

var EachBinding = function (_Binding2) {
  _inherits(EachBinding, _Binding2);

  function EachBinding(context, keypath, value, options) {
    _classCallCheck(this, EachBinding);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(EachBinding).call(this, context, keypath, value, options));

    _this3.itemBindings = [];
    _this3.empty = value.length == 0;
    _this3.options.hash.parentContext = _this3.context;
    return _this3;
  }

  _createClass(EachBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(EachBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this4 = this;

      this.setObserver(new _observeJs.ArrayObserver(this.value));
      this.observer.open(function (splices) {
        splices.forEach(function (splice) {
          _this4.empty = _this4.value.length == 0;
          _this4.render({ splice: splice });
        });

        _this4.value.forEach(function (item, index) {
          _this4.itemBindings[index].context.index = index;
        });
      });
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      var _this5 = this;

      var output = "";
      this.itemBindings = [];

      this.value.forEach(function (item, index) {
        var itemBinding = new ItemBinding((0, _deps.getUtils)().extend({ index: index, "$this": item }, _this5.context), null, item, _this5.options);
        _this5.itemBindings.push(itemBinding);
        output += itemBinding.initialize();
      });

      return this.setOutput(this.empty ? this.options.inverse(this.context) : output);
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.splice) {
        var splice = options.splice;

        if (splice.removed.length > 0) {
          var removedCount = 0;
          for (var index = splice.index; index < splice.index + splice.removed.length; index++) {
            this.removeItem(index - removedCount++);
          }
        }

        if (splice.addedCount > 0) {
          for (var _index = splice.index; _index < splice.index + splice.addedCount; _index++) {
            this.addItem(_index);
          }
        }
      } else {
        return _get(Object.getPrototypeOf(EachBinding.prototype), "render", this).call(this, options);
      }
    }
  }, {
    key: "addItem",
    value: function addItem(index) {
      var previous;

      if (this.itemBindings[index - 1]) {
        previous = this.itemBindings[index - 1].delimiter;
      } else {
        previous = this.marker;
      }

      var item = this.value[index];
      var itemBinding = new ItemBinding((0, _deps.getUtils)().extend({ index: index, "$this": item }, this.context), null, item, this.options);
      (0, _deps.getUtils)().insertAfter(previous, _deps2.default.Handlebars.parseHTML(itemBinding.initialize()));
      this.itemBindings.splice(index, 0, itemBinding);
    }
  }, {
    key: "removeItem",
    value: function removeItem(index) {
      var itemBinding = this.itemBindings[index];
      (0, _utils.removeBetween)(itemBinding.marker, itemBinding.delimiter).forEach(function (node) {
        return (0, _core.unbind)(node);
      });
      itemBinding.marker.remove();
      itemBinding.delimiter.remove();
      this.itemBindings.splice(index, 1);
    }
  }]);

  return EachBinding;
}(_binding2.default);

exports.default = EachBinding;

},{"../core":64,"../deps":65,"../utils":67,"./binding":60,"observe-js":90}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IfBinding = function (_Binding) {
  _inherits(IfBinding, _Binding);

  function IfBinding(context, keypath, value, options) {
    _classCallCheck(this, IfBinding);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IfBinding).call(this, context, keypath, value, options));

    _this.falsy = (0, _utils.isFalsy)(value);
    return _this;
  }

  _createClass(IfBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(IfBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      if ((0, _deps.getUtils)().isArray(this.value)) {
        this.setObserver(new _observeJs.ArrayObserver(this.value));
        this.observer.open(function () {
          if ((0, _utils.isFalsy)(_this2.value) != _this2.falsy) {
            _this2.falsy = (0, _utils.isFalsy)(_this2.value);
            _this2.render();
          }
        });
      } else {
        this.setObserver(new _observeJs.PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this2.value = value;
          if ((0, _utils.isFalsy)(_this2.value) != _this2.falsy) {
            _this2.falsy = (0, _utils.isFalsy)(_this2.value);
            _this2.render();
          }
        });
      }
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.falsy) {
        return this.setOutput(this.options.inverse ? this.options.inverse(this.context) : this.options.hash.else);
      } else {
        return this.setOutput(this.options.fn ? this.options.fn(this.context) : this.options.hash.then);
      }
    }
  }, {
    key: "renderAttribute",
    value: function renderAttribute() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.options.hash.attr == true) {
        this.node.removeAttribute(this.previousOutput);
        if (this.output) this.node.setAttribute(this.output, "");
      } else if (this.options.hash.attr == "class") {
        (0, _utils.removeClass)(this.node, this.previousOutput);
        (0, _utils.addClass)(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }]);

  return IfBinding;
}(_binding2.default);

exports.default = IfBinding;

},{"../deps":65,"../utils":67,"./binding":60,"observe-js":90}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EachBinding = exports.IfBinding = exports.Binding = undefined;

var _binding = require('./binding');

var _binding2 = _interopRequireDefault(_binding);

var _if_binding = require('./if_binding');

var _if_binding2 = _interopRequireDefault(_if_binding);

var _each_binding = require('./each_binding');

var _each_binding2 = _interopRequireDefault(_each_binding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Binding = _binding2.default;
exports.IfBinding = _if_binding2.default;
exports.EachBinding = _each_binding2.default;

},{"./binding":60,"./each_binding":61,"./if_binding":62}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;
exports.unbind = unbind;
exports.update = update;
exports.register = register;

var _observeJs = require("observe-js");

var _observeJs2 = _interopRequireDefault(_observeJs);

var _bindings = require("../bindings");

var _utils = require("../utils");

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bind(root) {
  (0, _utils.traverse)(root, function (node) {
    if (node.binding) {
      node.binding.observe();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.observe();
      });
    }
  });
};

function unbind(root) {
  (0, _utils.traverse)(root, function (node) {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.stopObserving();
      });
    }
  });
};

function update() {
  Platform.performMicrotaskCheckpoint();
};

function register() {
  _deps2.default.Handlebars.registerHelper('bind', function (keypath, options) {
    return new _bindings.Binding(this, keypath, null, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper('if', function (conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && (0, _deps.getUtils)().isString(conditional)) {
      keypath = conditional;
      conditional = (0, _utils.path)(this, keypath);
    }

    return new _bindings.IfBinding(this, keypath, conditional, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper('each', function (items, options) {
    return new _bindings.EachBinding(this, null, items, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper("unless", function (conditional, options) {
    var fn = options.fn;
    var inverse = options.inverse;

    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return _deps2.default.Handlebars.helpers.if.apply(this, [conditional, options]);
  });

  _deps2.default.Handlebars.registerElement('binding', function (attributes) {
    return attributes.id;
  });
};

},{"../bindings":63,"../deps":65,"../utils":67,"observe-js":90}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUtils = getUtils;
var deps = {};

function getUtils() {
  return deps.Handlebars.Utils;
}

exports.default = deps;

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HandlebarsBinding;

var _handlebars = require("handlebars.element");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _bindings = require("./bindings");

var _core = require("./core");

var _utils = require("./utils");

var _deps = require("./deps");

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HandlebarsBinding(Handlebars) {
  if (!_deps2.default.Handlebars) {
    (0, _handlebars2.default)(Handlebars);

    var extend = Handlebars.Utils.extend;


    extend(_deps2.default, { Handlebars: Handlebars });

    extend(Handlebars, {
      Binding: _bindings.Binding,
      IfBinding: _bindings.IfBinding,
      EachBinding: _bindings.EachBinding,
      bind: _core.bind,
      unbind: _core.unbind,
      update: _core.update
    });

    extend(Handlebars.Utils, {
      path: _utils.path,
      traverse: _utils.traverse,
      removeBetween: _utils.removeBetween,
      nodesBetween: _utils.nodesBetween,
      removeClass: _utils.removeClass,
      addClass: _utils.addClass,
      hasClass: _utils.hasClass,
      isFalsy: _utils.isFalsy
    });

    (0, _core.register)();
  }

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding(window.Handlebars);
}

},{"./bindings":63,"./core":64,"./deps":65,"./utils":67,"handlebars.element":70}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFalsy = isFalsy;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.nodesBetween = nodesBetween;
exports.removeBetween = removeBetween;
exports.traverse = traverse;
exports.path = path;

var _deps = require('../deps');

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFalsy(object) {
  return !object || (0, _deps.getUtils)().isEmpty(object);
}

function hasClass(node, value) {
  return node.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
}

function addClass(node, value) {
  if (!hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += ' ' + value;
    }
  }
}

function removeClass(node, value) {
  if (hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
  }
}

function nodesBetween(firstNode, lastNode) {
  var next = firstNode.nextSibling;
  var nodes = [];

  while (next && next != lastNode) {
    var sibling = next.nextSibling;
    nodes.push(next);
    next = sibling;
  }

  return nodes;
}

function removeBetween(firstNode, lastNode) {
  var nodes = nodesBetween(firstNode, lastNode);
  nodes.forEach(function (node) {
    return node.remove();
  });
  return nodes;
}

function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    traverse(node, callback);
    node = node.nextSibling;
  }
}

function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach(function (path) {
    return object = object[path];
  });
  return object;
}

},{"../deps":65}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attributes = exports.elements = undefined;
exports.registerElement = registerElement;
exports.registerAttribute = registerAttribute;
exports.parseValue = parseValue;
exports.parseHTML = parseHTML;

var _utils = require("../utils");

var _store = require("../store");

var _store2 = _interopRequireDefault(_store);

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elements = exports.elements = {};
var attributes = exports.attributes = {};

function registerElement(name, fn, options) {
  fn.options = options || {};
  elements[name] = fn;
}

function registerAttribute(name, fn, options) {
  fn.options = options || {};
  attributes[name] = fn;
}

function parseValue(value, bool) {
  var object = _store2.default[value];

  if (object) {
    value = object;
  } else if (value == "true") {
    value = true;
  } else if (value == "false") {
    value = false;
  } else if (value == "null") {
    value = undefined;
  } else if (value == "undefined") {
    value = undefined;
  } else if (!isNaN(value) && value != "") {
    value = parseFloat(value);
  }

  return bool ? value || value === "" ? true : false : value === "" ? undefined : value;
}

function parseHTML(html) {
  var bindings = [];

  if (html instanceof _deps2.default.Handlebars.SafeString) {
    html = html.toString();
  }

  if ((0, _utils.isString)(html)) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    var rootNodes = div.childNodes;
  } else {
    var rootNodes = html;
  }

  var nodes = (0, _utils.flatten)(rootNodes);

  while (nodes.length != 0) {
    var nextNodes = [];

    for (var index = 0; index < nodes.length; index++) {
      var binding = { owner: nodes[index], element: undefined, attributes: [] };
      var childNodes = (0, _utils.flatten)(nodes[index].childNodes);

      for (var bIndex = 0; bIndex < childNodes.length; bIndex++) {
        nextNodes.push(childNodes[bIndex]);
      }

      if (nodes[index].attributes) {
        for (var bIndex = 0; bIndex < nodes[index].attributes.length; bIndex++) {
          if (/hb-/i.test(nodes[index].attributes[bIndex].name)) {
            binding.attributes.push(nodes[index].attributes[bIndex]);
          }
        }
      }

      if (/^hb-/i.test(nodes[index].nodeName)) {
        binding.element = nodes[index];
      }

      if (binding.element || binding.attributes.length > 0) {
        bindings.unshift(binding);
      }
    }

    nodes = nextNodes;
  }

  for (var index = 0; index < bindings.length; index++) {
    var bindingOwner = bindings[index].owner;
    var bindingElement = bindings[index].element;
    var bindingAttributes = bindings[index].attributes;

    if (bindingAttributes.length > 0) {
      for (var bIndex = 0; bIndex < bindingAttributes.length; bIndex++) {
        var bindingAttribute = bindingAttributes[bIndex];
        var bindingAttributeName = bindingAttribute.name.replace("hb-", "");
        var bindingAttributeFn = attributes[bindingAttributeName];
        var newAttribute = bindingAttributeFn.apply(bindingAttribute, [bindingOwner]);

        if (newAttribute) {
          bindingOwner.setAttributeNode(newAttribute);
        }

        bindingOwner.removeAttributeNode(bindingAttribute);

        if (bindingAttributeFn.options.ready && !/hb-/i.test(bindingOwner.tagName.toLowerCase())) {
          bindingAttributeFn.options.ready.apply(bindingAttribute, [bindingOwner]);
        }
      }
    }

    if (bindingElement) {
      var bindingElementAttributes = {};
      var bindingElementName = bindingElement.tagName.toLowerCase().replace("hb-", "");
      var bindingElementFn = elements[bindingElementName];

      for (var bIndex = 0; bIndex < bindingElement.attributes.length; bIndex++) {
        var bindingAttribute = bindingElement.attributes.item(bIndex);
        var bindingAttributeName = (0, _utils.camelize)(bindingAttribute.nodeName);
        var bool = bindingElementFn.options.booleans && bindingElementFn.options.booleans.indexOf(bindingAttributeName) >= 0;

        bindingElementAttributes[bindingAttributeName] = this.parseValue(bindingAttribute.nodeValue, bool);
      }

      var newElement = bindingElementFn.apply(bindingElement, [bindingElementAttributes]);
      (0, _utils.replaceWith)(bindingElement, newElement);

      for (var bIndex = 0; bIndex < bindingAttributes.length; bIndex++) {
        var bindingAttribute = bindingAttributes[bIndex];
        var bindingAttributeName = bindingAttribute.name.replace("hb-", "");
        var bindingAttributeFn = attributes[bindingAttributeName];

        if (bindingAttributeFn.options.ready) {
          bindingAttributeFn.options.ready.apply(bindingAttribute, [newElement]);
        }
      }
    }
  }

  return (0, _utils.flatten)(rootNodes);
};

},{"../deps":69,"../store":71,"../utils":72}],69:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HandlebarsElement;

var _utils = require('./utils');

var _core = require('./core');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _deps = require('./deps');

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HandlebarsElement(Handlebars) {
  if (!_deps2.default.Handlebars) {
    (0, _utils.extend)(_deps2.default, { Handlebars: Handlebars });

    (0, _utils.extend)(Handlebars, {
      store: _store2.default,
      elements: _core.elements,
      attributes: _core.attributes,
      registerElement: _core.registerElement,
      registerAttribute: _core.registerAttribute,
      parseValue: _core.parseValue,
      parseHTML: _core.parseHTML
    });

    (0, _utils.extend)(Handlebars.Utils, {
      extend: _utils.extend,
      isObject: _utils.isObject,
      isString: _utils.isString,
      uniqueId: _utils.uniqueId,
      flatten: _utils.flatten,
      camelize: _utils.camelize,
      replaceWith: _utils.replaceWith,
      insertAfter: _utils.insertAfter,
      escapeExpression: _utils.escapeExpression,
      _escapeExpression: Handlebars.Utils.escapeExpression
    });
  }

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsElement(window.Handlebars);
}

},{"./core":68,"./deps":69,"./store":71,"./utils":72}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hold = hold;
exports.release = release;
exports.keyFor = keyFor;

var _utils = require("../utils");

var store = {};

function hold(key, value) {
  return store[key] = value;
}

function release(key) {
  var value = store[key];
  delete store[key];
  return value;
}

function keyFor(value) {
  for (var key in store) {
    if (store[key] == value) {
      return key;
    }
  }
}

(0, _utils.extend)(store, { hold: hold, release: release, keyFor: keyFor });

exports.default = store;

},{"../utils":72}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.isObject = isObject;
exports.isString = isString;
exports.uniqueId = uniqueId;
exports.flatten = flatten;
exports.camelize = camelize;
exports.replaceWith = replaceWith;
exports.insertAfter = insertAfter;
exports.escapeExpression = escapeExpression;

var _store = require("../store");

var _store2 = _interopRequireDefault(_store);

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(object) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        object[key] = arguments[i][key];
      }
    }
  }

  return object;
}

function isObject(object) {
  return object === Object(object);
}

function isString(object) {
  return toString.call(object) == '[object String]';
}

function uniqueId() {
  var generate = function generate(bool) {
    var random = (Math.random().toString(16) + "000000000").substr(2, 8);
    return bool ? "-" + random.substr(0, 4) + "-" + random.substr(4, 4) : random;
  };

  return generate() + generate(true) + generate(true) + generate();
}

function flatten(array, flattenArray) {
  flattenArray = flattenArray || [];

  for (var index = 0; index < array.length; index++) {
    if ((0, _deps.getUtils)().isArray(array[index])) {
      flatten(array[index], flattenArray);
    } else {
      flattenArray.push(array[index]);
    }
  };

  return flattenArray;
}

function camelize(string) {
  return string.trim().replace(/[-_\s]+(.)?/g, function (match, word) {
    return word ? word.toUpperCase() : "";
  });
}

function replaceWith(node, nodes) {
  nodes = (0, _deps.getUtils)().isArray(nodes) ? nodes : [nodes];

  for (var index = 0; index < nodes.length; index++) {
    if (index == 0) {
      node.parentNode.replaceChild(nodes[index], node);
    } else {
      insertAfter(nodes[index - 1], nodes[index]);
    }
  }
}

function insertAfter(node, nodes) {
  nodes = (0, _deps.getUtils)().isArray(nodes) ? nodes.slice() : [nodes];
  nodes.unshift(node);

  for (var index = 1; index < nodes.length; index++) {
    if (nodes[index - 1].nextSibling) {
      nodes[index - 1].parentNode.insertBefore(nodes[index], nodes[index - 1].nextSibling);
    } else {
      nodes[index - 1].parentNode.appendChild(nodes[index]);
    }
  }
}

function escapeExpression(value) {
  if (isObject(value) && !(value instanceof _deps2.default.Handlebars.SafeString)) {
    var id = _store2.default.keyFor(value);

    if (id) {
      value = id;
    } else {
      id = uniqueId();
      _store2.default.hold(id, value);
      value = id;
    }
  } else if (value === false) {
    value = value.toString();
  }

  return (0, _deps.getUtils)()._escapeExpression(value);
}

},{"../deps":69,"../store":71}],73:[function(require,module,exports){
(function (global){
// jquery.lifecycle
// ----------------
// v0.1.2
//
// Copyright (c) 2013-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/jquery.lifecycle

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var MutationObserver = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(global.$, MutationObserver);
    exports = factory(global.$, MutationObserver);
  } else {
    factory(root.$, root.MutationObserver || root.WebKitMutationObserver || root.MozMutationObserver);
  }

}(this, function($, MutationObserver) {

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var lifecycles = function(node) {
    var nodes = $(node).find('[lifecycle]').toArray();
    if ($(node).is('[lifecycle]')) nodes.push(node);
    return nodes;
  };

  var observeAttribute = function(node, callback) {
    var attributeObserver = new MutationObserver(function(mutations) {
      $.each(mutations, function(index, mutation) {
        var attribute = node.attributes[mutation.attributeName];
        if (!attribute || attribute.value != mutation.oldValue) {
          callback.apply(node, [mutation.attributeName, (attribute ? attribute.value : undefined)]);
        }
      });
    });

    attributeObserver.observe(node, {subtree: false, attributes: true, attributeOldValue: true});

    return attributeObserver;
  };

  var observeSubtree = function(node, callback) {
    var subtreeObserver = new MutationObserver(function(mutations) {
      $.each(mutations, function(index, mutation) {
        if (mutation.type === 'childList') {
          $.each(mutation.addedNodes, function(index, childrenNode) {
            callback.apply(node, [childrenNode]);
          });
        }
      });
    });

    subtreeObserver.observe(node, {childList: true, subtree: true});

    return subtreeObserver;
  };

  var observer = new MutationObserver(function(mutations) {
    $.each(mutations, function(index, mutation) {
      if (mutation.type === 'childList') {
        $.each(mutation.addedNodes, function(index, node) {
          $.each(lifecycles(node), function(index, node) {
            $.each(node.whenInsert || [], function(index, callback) {
              if (!node.inserted) callback.apply(node);
            });
            node.inserted = true;
          });
        });

        $.each(mutation.removedNodes, function(index, node) {
          $.each(lifecycles(node), function(index, node) {
            $.each(node.whenRemove || [], function(index, callback) {
              if (node.inserted) callback.apply(node);
            });
            node.inserted = false;
          });
        });
      }
    });
  });

  $(function() {
    observer.observe(document.body, {childList: true, subtree: true});
  });

  $.fn.lifecycle = function(options) {
    return this.each(function() {
      var element = $(this)[0];

      element.inserted = false;
      element.whenInsert = element.whenInsert || [];
      element.whenRemove = element.whenRemove || [];
      element.whenChange = element.whenChange || [];
      element.whenSubtreeChange = element.whenSubtreeChange || [];

      options = options || {};
      if (options.insert) element.whenInsert.push(options.insert);
      if (options.remove) element.whenRemove.push(options.remove);
      if (options.change) element.whenChange.push(observeAttribute(element, options.change));
      if (options.subtreeChange) element.whenSubtreeChange.push(observeSubtree(element, options.subtreeChange));

      $(this).attr('lifecycle', '');
    });
  };

  $.fn.unlifecycle = function() {
    return this.each(function() {
      var element = $(this)[0];

      $.each(element.whenChange, function(index, attributeObserver) {
        attributeObserver.disconnect();
      });

      $.each(element.whenSubtreeChange, function(index, subtreeObserver) {
        subtreeObserver.disconnect();
      });

      delete element.inserted;
      delete element.whenInsert;
      delete element.whenRemove;
      delete element.whenChange;

      $(this).removeAttr('lifecycle');
    });
  };

}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],74:[function(require,module,exports){

var Pipe = require('../pipe').Pipe;

var Context = function Context(){
};

Context.prototype.setResult = function(result) {
	this.result = result;
	this.hasResult = true;
	return this;
};

Context.prototype.exit = function() {
	this.exiting = true;
	return this;
};

Context.prototype.switchTo = function(next, pipe) {
	if (typeof next === 'string' || next instanceof Pipe) {
		this.nextPipe = next;
	} else {
		this.next = next;
		if (pipe) {
			this.nextPipe = pipe;
		}
	}
	return this;
};

Context.prototype.push = function(child, name) {
	child.parent = this;
	if (typeof name !== 'undefined') {
		child.childName = name;
	}
	child.root = this.root || this;
	child.options = child.options || this.options;
	if (!this.children) {
		this.children = [child];
		this.nextAfterChildren = this.next || null;
		this.next = child;
	} else {
		this.children[this.children.length - 1].next = child;
		this.children.push(child);
	}
	child.next = this;
	return this;
};

exports.Context = Context;

},{"../pipe":88}],75:[function(require,module,exports){
var Context = require('./context').Context;
var dateReviver = require('../date-reviver');

var DiffContext = function DiffContext(left, right) {
  this.left = left;
  this.right = right;
  this.pipe = 'diff';
};

DiffContext.prototype = new Context();

DiffContext.prototype.setResult = function(result) {
  if (this.options.cloneDiffValues) {
    var clone = typeof this.options.cloneDiffValues === 'function' ?
      this.options.cloneDiffValues : function(value) {
        return JSON.parse(JSON.stringify(value), dateReviver);
      };
    if (typeof result[0] === 'object') {
      result[0] = clone(result[0]);
    }
    if (typeof result[1] === 'object') {
      result[1] = clone(result[1]);
    }
  }
  return Context.prototype.setResult.apply(this, arguments);
};

exports.DiffContext = DiffContext;

},{"../date-reviver":78,"./context":74}],76:[function(require,module,exports){
var Context = require('./context').Context;

var PatchContext = function PatchContext(left, delta) {
  this.left = left;
  this.delta = delta;
  this.pipe = 'patch';
};

PatchContext.prototype = new Context();

exports.PatchContext = PatchContext;

},{"./context":74}],77:[function(require,module,exports){
var Context = require('./context').Context;

var ReverseContext = function ReverseContext(delta) {
  this.delta = delta;
  this.pipe = 'reverse';
};

ReverseContext.prototype = new Context();

exports.ReverseContext = ReverseContext;

},{"./context":74}],78:[function(require,module,exports){
// use as 2nd parameter for JSON.parse to revive Date instances
module.exports = function dateReviver(key, value) {
  var parts;
  if (typeof value === 'string') {
    parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?(Z|([+\-])(\d{2}):(\d{2}))$/.exec(value);
    if (parts) {
      return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6], +(parts[7] || 0)));
    }
  }
  return value;
};

},{}],79:[function(require,module,exports){
var Processor = require('./processor').Processor;
var Pipe = require('./pipe').Pipe;
var DiffContext = require('./contexts/diff').DiffContext;
var PatchContext = require('./contexts/patch').PatchContext;
var ReverseContext = require('./contexts/reverse').ReverseContext;

var trivial = require('./filters/trivial');
var nested = require('./filters/nested');
var arrays = require('./filters/arrays');
var dates = require('./filters/dates');
var texts = require('./filters/texts');

var DiffPatcher = function DiffPatcher(options) {
  this.processor = new Processor(options);
  this.processor.pipe(new Pipe('diff').append(
    nested.collectChildrenDiffFilter,
    trivial.diffFilter,
    dates.diffFilter,
    texts.diffFilter,
    nested.objectsDiffFilter,
    arrays.diffFilter
  ).shouldHaveResult());
  this.processor.pipe(new Pipe('patch').append(
    nested.collectChildrenPatchFilter,
    arrays.collectChildrenPatchFilter,
    trivial.patchFilter,
    texts.patchFilter,
    nested.patchFilter,
    arrays.patchFilter
  ).shouldHaveResult());
  this.processor.pipe(new Pipe('reverse').append(
    nested.collectChildrenReverseFilter,
    arrays.collectChildrenReverseFilter,
    trivial.reverseFilter,
    texts.reverseFilter,
    nested.reverseFilter,
    arrays.reverseFilter
  ).shouldHaveResult());
};

DiffPatcher.prototype.options = function() {
  return this.processor.options.apply(this.processor, arguments);
};

DiffPatcher.prototype.diff = function(left, right) {
  return this.processor.process(new DiffContext(left, right));
};

DiffPatcher.prototype.patch = function(left, delta) {
  return this.processor.process(new PatchContext(left, delta));
};

DiffPatcher.prototype.reverse = function(delta) {
  return this.processor.process(new ReverseContext(delta));
};

DiffPatcher.prototype.unpatch = function(right, delta) {
  return this.patch(right, this.reverse(delta));
};

exports.DiffPatcher = DiffPatcher;

},{"./contexts/diff":75,"./contexts/patch":76,"./contexts/reverse":77,"./filters/arrays":81,"./filters/dates":82,"./filters/nested":84,"./filters/texts":85,"./filters/trivial":86,"./pipe":88,"./processor":89}],80:[function(require,module,exports){

exports.isBrowser = typeof window !== 'undefined';

},{}],81:[function(require,module,exports){
var DiffContext = require('../contexts/diff').DiffContext;
var PatchContext = require('../contexts/patch').PatchContext;
var ReverseContext = require('../contexts/reverse').ReverseContext;

var lcs = require('./lcs');

var ARRAY_MOVE = 3;

var isArray = (typeof Array.isArray === 'function') ?
  // use native function
  Array.isArray :
  // use instanceof operator
  function(a) {
    return a instanceof Array;
  };

var arrayIndexOf = typeof Array.prototype.indexOf === 'function' ?
  function(array, item) {
    return array.indexOf(item);
  } : function(array, item) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };

function arraysHaveMatchByRef(array1, array2, len1, len2) {
  for (var index1 = 0; index1 < len1; index1++) {
    var val1 = array1[index1];
    for (var index2 = 0; index2 < len2; index2++) {
      var val2 = array2[index2];
      if (val1 === val2) {
        return true;
      }
    }
  }
}

function matchItems(array1, array2, index1, index2, context) {
  var value1 = array1[index1];
  var value2 = array2[index2];
  if (value1 === value2) {
    return true;
  }
  if (typeof value1 !== 'object' || typeof value2 !== 'object') {
    return false;
  }
  var objectHash = context.objectHash;
  if (!objectHash) {
    // no way to match objects was provided, try match by position
    return context.matchByPosition && index1 === index2;
  }
  var hash1;
  var hash2;
  if (typeof index1 === 'number') {
    context.hashCache1 = context.hashCache1 || [];
    hash1 = context.hashCache1[index1];
    if (typeof hash1 === 'undefined') {
      context.hashCache1[index1] = hash1 = objectHash(value1, index1);
    }
  } else {
    hash1 = objectHash(value1);
  }
  if (typeof hash1 === 'undefined') {
    return false;
  }
  if (typeof index2 === 'number') {
    context.hashCache2 = context.hashCache2 || [];
    hash2 = context.hashCache2[index2];
    if (typeof hash2 === 'undefined') {
      context.hashCache2[index2] = hash2 = objectHash(value2, index2);
    }
  } else {
    hash2 = objectHash(value2);
  }
  if (typeof hash2 === 'undefined') {
    return false;
  }
  return hash1 === hash2;
}

var diffFilter = function arraysDiffFilter(context) {
  if (!context.leftIsArray) {
    return;
  }

  var matchContext = {
    objectHash: context.options && context.options.objectHash,
    matchByPosition: context.options && context.options.matchByPosition
  };
  var commonHead = 0;
  var commonTail = 0;
  var index;
  var index1;
  var index2;
  var array1 = context.left;
  var array2 = context.right;
  var len1 = array1.length;
  var len2 = array2.length;

  var child;

  if (len1 > 0 && len2 > 0 && !matchContext.objectHash &&
    typeof matchContext.matchByPosition !== 'boolean') {
    matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
  }

  // separate common head
  while (commonHead < len1 && commonHead < len2 &&
    matchItems(array1, array2, commonHead, commonHead, matchContext)) {
    index = commonHead;
    child = new DiffContext(context.left[index], context.right[index]);
    context.push(child, index);
    commonHead++;
  }
  // separate common tail
  while (commonTail + commonHead < len1 && commonTail + commonHead < len2 &&
    matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
    index1 = len1 - 1 - commonTail;
    index2 = len2 - 1 - commonTail;
    child = new DiffContext(context.left[index1], context.right[index2]);
    context.push(child, index2);
    commonTail++;
  }
  var result;
  if (commonHead + commonTail === len1) {
    if (len1 === len2) {
      // arrays are identical
      context.setResult(undefined).exit();
      return;
    }
    // trivial case, a block (1 or more consecutive items) was added
    result = result || {
      _t: 'a'
    };
    for (index = commonHead; index < len2 - commonTail; index++) {
      result[index] = [array2[index]];
    }
    context.setResult(result).exit();
    return;
  }
  if (commonHead + commonTail === len2) {
    // trivial case, a block (1 or more consecutive items) was removed
    result = result || {
      _t: 'a'
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      result['_' + index] = [array1[index], 0, 0];
    }
    context.setResult(result).exit();
    return;
  }
  // reset hash cache
  delete matchContext.hashCache1;
  delete matchContext.hashCache2;

  // diff is not trivial, find the LCS (Longest Common Subsequence)
  var trimmed1 = array1.slice(commonHead, len1 - commonTail);
  var trimmed2 = array2.slice(commonHead, len2 - commonTail);
  var seq = lcs.get(
    trimmed1, trimmed2,
    matchItems,
    matchContext
  );
  var removedItems = [];
  result = result || {
    _t: 'a'
  };
  for (index = commonHead; index < len1 - commonTail; index++) {
    if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
      // removed
      result['_' + index] = [array1[index], 0, 0];
      removedItems.push(index);
    }
  }

  var detectMove = true;
  if (context.options && context.options.arrays && context.options.arrays.detectMove === false) {
    detectMove = false;
  }
  var includeValueOnMove = false;
  if (context.options && context.options.arrays && context.options.arrays.includeValueOnMove) {
    includeValueOnMove = true;
  }

  var removedItemsLength = removedItems.length;
  for (index = commonHead; index < len2 - commonTail; index++) {
    var indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
    if (indexOnArray2 < 0) {
      // added, try to match with a removed item and register as position move
      var isMove = false;
      if (detectMove && removedItemsLength > 0) {
        for (var removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
          index1 = removedItems[removeItemIndex1];
          if (matchItems(trimmed1, trimmed2, index1 - commonHead,
            index - commonHead, matchContext)) {
            // store position move as: [originalValue, newPosition, ARRAY_MOVE]
            result['_' + index1].splice(1, 2, index, ARRAY_MOVE);
            if (!includeValueOnMove) {
              // don't include moved value on diff, to save bytes
              result['_' + index1][0] = '';
            }

            index2 = index;
            child = new DiffContext(context.left[index1], context.right[index2]);
            context.push(child, index2);
            removedItems.splice(removeItemIndex1, 1);
            isMove = true;
            break;
          }
        }
      }
      if (!isMove) {
        // added
        result[index] = [array2[index]];
      }
    } else {
      // match, do inner diff
      index1 = seq.indices1[indexOnArray2] + commonHead;
      index2 = seq.indices2[indexOnArray2] + commonHead;
      child = new DiffContext(context.left[index1], context.right[index2]);
      context.push(child, index2);
    }
  }

  context.setResult(result).exit();

};
diffFilter.filterName = 'arrays';

var compare = {
  numerically: function(a, b) {
    return a - b;
  },
  numericallyBy: function(name) {
    return function(a, b) {
      return a[name] - b[name];
    };
  }
};

var patchFilter = function nestedPatchFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var index, index1;

  var delta = context.delta;
  var array = context.left;

  // first, separate removals, insertions and modifications
  var toRemove = [];
  var toInsert = [];
  var toModify = [];
  for (index in delta) {
    if (index !== '_t') {
      if (index[0] === '_') {
        // removed item from original array
        if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE) {
          toRemove.push(parseInt(index.slice(1), 10));
        } else {
          throw new Error('only removal or move can be applied at original array indices' +
            ', invalid diff type: ' + delta[index][2]);
        }
      } else {
        if (delta[index].length === 1) {
          // added item at new array
          toInsert.push({
            index: parseInt(index, 10),
            value: delta[index][0]
          });
        } else {
          // modified item at new array
          toModify.push({
            index: parseInt(index, 10),
            delta: delta[index]
          });
        }
      }
    }
  }

  // remove items, in reverse order to avoid sawing our own floor
  toRemove = toRemove.sort(compare.numerically);
  for (index = toRemove.length - 1; index >= 0; index--) {
    index1 = toRemove[index];
    var indexDiff = delta['_' + index1];
    var removedValue = array.splice(index1, 1)[0];
    if (indexDiff[2] === ARRAY_MOVE) {
      // reinsert later
      toInsert.push({
        index: indexDiff[1],
        value: removedValue
      });
    }
  }

  // insert items, in reverse order to avoid moving our own floor
  toInsert = toInsert.sort(compare.numericallyBy('index'));
  var toInsertLength = toInsert.length;
  for (index = 0; index < toInsertLength; index++) {
    var insertion = toInsert[index];
    array.splice(insertion.index, 0, insertion.value);
  }

  // apply modifications
  var toModifyLength = toModify.length;
  var child;
  if (toModifyLength > 0) {
    for (index = 0; index < toModifyLength; index++) {
      var modification = toModify[index];
      child = new PatchContext(context.left[modification.index], modification.delta);
      context.push(child, modification.index);
    }
  }

  if (!context.children) {
    context.setResult(context.left).exit();
    return;
  }
  context.exit();
};
patchFilter.filterName = 'arrays';

var collectChildrenPatchFilter = function collectChildrenPatchFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var length = context.children.length;
  var child;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    context.left[child.childName] = child.result;
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter.filterName = 'arraysCollectChildren';

var reverseFilter = function arraysReverseFilter(context) {
  if (!context.nested) {
    if (context.delta[2] === ARRAY_MOVE) {
      context.newName = '_' + context.delta[1];
      context.setResult([context.delta[0], parseInt(context.childName.substr(1), 10), ARRAY_MOVE]).exit();
    }
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var name, child;
  for (name in context.delta) {
    if (name === '_t') {
      continue;
    }
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter.filterName = 'arrays';

var reverseArrayDeltaIndex = function(delta, index, itemDelta) {
  if (typeof index === 'string' && index[0] === '_') {
    return parseInt(index.substr(1), 10);
  } else if (isArray(itemDelta) && itemDelta[2] === 0) {
    return '_' + index;
  }

  var reverseIndex = +index;
  for (var deltaIndex in delta) {
    var deltaItem = delta[deltaIndex];
    if (isArray(deltaItem)) {
      if (deltaItem[2] === ARRAY_MOVE) {
        var moveFromIndex = parseInt(deltaIndex.substr(1), 10);
        var moveToIndex = deltaItem[1];
        if (moveToIndex === +index) {
          return moveFromIndex;
        }
        if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
          reverseIndex++;
        } else if (moveFromIndex >= reverseIndex && moveToIndex < reverseIndex) {
          reverseIndex--;
        }
      } else if (deltaItem[2] === 0) {
        var deleteIndex = parseInt(deltaIndex.substr(1), 10);
        if (deleteIndex <= reverseIndex) {
          reverseIndex++;
        }
      } else if (deltaItem.length === 1 && deltaIndex <= reverseIndex) {
        reverseIndex--;
      }
    }
  }

  return reverseIndex;
};

var collectChildrenReverseFilter = function collectChildrenReverseFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var length = context.children.length;
  var child;
  var delta = {
    _t: 'a'
  };

  for (var index = 0; index < length; index++) {
    child = context.children[index];
    var name = child.newName;
    if (typeof name === 'undefined') {
      name = reverseArrayDeltaIndex(context.delta, child.childName, child.result);
    }
    if (delta[name] !== child.result) {
      delta[name] = child.result;
    }
  }
  context.setResult(delta).exit();
};
collectChildrenReverseFilter.filterName = 'arraysCollectChildren';

exports.diffFilter = diffFilter;
exports.patchFilter = patchFilter;
exports.collectChildrenPatchFilter = collectChildrenPatchFilter;
exports.reverseFilter = reverseFilter;
exports.collectChildrenReverseFilter = collectChildrenReverseFilter;

},{"../contexts/diff":75,"../contexts/patch":76,"../contexts/reverse":77,"./lcs":83}],82:[function(require,module,exports){
var diffFilter = function datesDiffFilter(context) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([context.left, context.right]);
      } else {
        context.setResult(undefined);
      }
    } else {
      context.setResult([context.left, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([context.left, context.right]).exit();
  }
};
diffFilter.filterName = 'dates';

exports.diffFilter = diffFilter;

},{}],83:[function(require,module,exports){
/*

LCS implementation that supports arrays or strings

reference: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem

*/

var defaultMatch = function(array1, array2, index1, index2) {
  return array1[index1] === array2[index2];
};

var lengthMatrix = function(array1, array2, match, context) {
  var len1 = array1.length;
  var len2 = array2.length;
  var x, y;

  // initialize empty matrix of len1+1 x len2+1
  var matrix = [len1 + 1];
  for (x = 0; x < len1 + 1; x++) {
    matrix[x] = [len2 + 1];
    for (y = 0; y < len2 + 1; y++) {
      matrix[x][y] = 0;
    }
  }
  matrix.match = match;
  // save sequence lengths for each coordinate
  for (x = 1; x < len1 + 1; x++) {
    for (y = 1; y < len2 + 1; y++) {
      if (match(array1, array2, x - 1, y - 1, context)) {
        matrix[x][y] = matrix[x - 1][y - 1] + 1;
      } else {
        matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
      }
    }
  }
  return matrix;
};

var backtrack = function(matrix, array1, array2, index1, index2, context) {
  if (index1 === 0 || index2 === 0) {
    return {
      sequence: [],
      indices1: [],
      indices2: []
    };
  }

  if (matrix.match(array1, array2, index1 - 1, index2 - 1, context)) {
    var subsequence = backtrack(matrix, array1, array2, index1 - 1, index2 - 1, context);
    subsequence.sequence.push(array1[index1 - 1]);
    subsequence.indices1.push(index1 - 1);
    subsequence.indices2.push(index2 - 1);
    return subsequence;
  }

  if (matrix[index1][index2 - 1] > matrix[index1 - 1][index2]) {
    return backtrack(matrix, array1, array2, index1, index2 - 1, context);
  } else {
    return backtrack(matrix, array1, array2, index1 - 1, index2, context);
  }
};

var get = function(array1, array2, match, context) {
  context = context || {};
  var matrix = lengthMatrix(array1, array2, match || defaultMatch, context);
  var result = backtrack(matrix, array1, array2, array1.length, array2.length, context);
  if (typeof array1 === 'string' && typeof array2 === 'string') {
    result.sequence = result.sequence.join('');
  }
  return result;
};

exports.get = get;

},{}],84:[function(require,module,exports){
var DiffContext = require('../contexts/diff').DiffContext;
var PatchContext = require('../contexts/patch').PatchContext;
var ReverseContext = require('../contexts/reverse').ReverseContext;

var collectChildrenDiffFilter = function collectChildrenDiffFilter(context) {
  if (!context || !context.children) {
    return;
  }
  var length = context.children.length;
  var child;
  var result = context.result;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (typeof child.result === 'undefined') {
      continue;
    }
    result = result || {};
    result[child.childName] = child.result;
  }
  if (result && context.leftIsArray) {
    result._t = 'a';
  }
  context.setResult(result).exit();
};
collectChildrenDiffFilter.filterName = 'collectChildren';

var objectsDiffFilter = function objectsDiffFilter(context) {
  if (context.leftIsArray || context.leftType !== 'object') {
    return;
  }

  var name, child, propertyFilter = context.options.propertyFilter;
  for (name in context.left) {
    if (!Object.prototype.hasOwnProperty.call(context.left, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    child = new DiffContext(context.left[name], context.right[name]);
    context.push(child, name);
  }
  for (name in context.right) {
    if (!Object.prototype.hasOwnProperty.call(context.right, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    if (typeof context.left[name] === 'undefined') {
      child = new DiffContext(undefined, context.right[name]);
      context.push(child, name);
    }
  }

  if (!context.children || context.children.length === 0) {
    context.setResult(undefined).exit();
    return;
  }
  context.exit();
};
objectsDiffFilter.filterName = 'objects';

var patchFilter = function nestedPatchFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name, child;
  for (name in context.delta) {
    child = new PatchContext(context.left[name], context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
patchFilter.filterName = 'objects';

var collectChildrenPatchFilter = function collectChildrenPatchFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (Object.prototype.hasOwnProperty.call(context.left, child.childName) && child.result === undefined) {
      delete context.left[child.childName];
    } else if (context.left[child.childName] !== child.result) {
      context.left[child.childName] = child.result;
    }
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter.filterName = 'collectChildren';

var reverseFilter = function nestedReverseFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name, child;
  for (name in context.delta) {
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter.filterName = 'objects';

var collectChildrenReverseFilter = function collectChildrenReverseFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child;
  var delta = {};
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (delta[child.childName] !== child.result) {
      delta[child.childName] = child.result;
    }
  }
  context.setResult(delta).exit();
};
collectChildrenReverseFilter.filterName = 'collectChildren';

exports.collectChildrenDiffFilter = collectChildrenDiffFilter;
exports.objectsDiffFilter = objectsDiffFilter;
exports.patchFilter = patchFilter;
exports.collectChildrenPatchFilter = collectChildrenPatchFilter;
exports.reverseFilter = reverseFilter;
exports.collectChildrenReverseFilter = collectChildrenReverseFilter;

},{"../contexts/diff":75,"../contexts/patch":76,"../contexts/reverse":77}],85:[function(require,module,exports){
/* global diff_match_patch */
var TEXT_DIFF = 2;
var DEFAULT_MIN_LENGTH = 60;
var cachedDiffPatch = null;

var getDiffMatchPatch = function(required) {
  /*jshint camelcase: false */

  if (!cachedDiffPatch) {
    var instance;
    if (typeof diff_match_patch !== 'undefined') {
      // already loaded, probably a browser
      instance = typeof diff_match_patch === 'function' ?
        new diff_match_patch() : new diff_match_patch.diff_match_patch();
    } else if (typeof require === 'function') {
      try {
        var dmpModuleName = 'diff_match_patch_uncompressed';
        var dmp = require('../../public/external/' + dmpModuleName);
        instance = new dmp.diff_match_patch();
      } catch (err) {
        instance = null;
      }
    }
    if (!instance) {
      if (!required) {
        return null;
      }
      var error = new Error('text diff_match_patch library not found');
      error.diff_match_patch_not_found = true;
      throw error;
    }
    cachedDiffPatch = {
      diff: function(txt1, txt2) {
        return instance.patch_toText(instance.patch_make(txt1, txt2));
      },
      patch: function(txt1, patch) {
        var results = instance.patch_apply(instance.patch_fromText(patch), txt1);
        for (var i = 0; i < results[1].length; i++) {
          if (!results[1][i]) {
            var error = new Error('text patch failed');
            error.textPatchFailed = true;
          }
        }
        return results[0];
      }
    };
  }
  return cachedDiffPatch;
};

var diffFilter = function textsDiffFilter(context) {
  if (context.leftType !== 'string') {
    return;
  }
  var minLength = (context.options && context.options.textDiff &&
    context.options.textDiff.minLength) || DEFAULT_MIN_LENGTH;
  if (context.left.length < minLength ||
    context.right.length < minLength) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  // large text, try to use a text-diff algorithm
  var diffMatchPatch = getDiffMatchPatch();
  if (!diffMatchPatch) {
    // diff-match-patch library not available, fallback to regular string replace
    context.setResult([context.left, context.right]).exit();
    return;
  }
  var diff = diffMatchPatch.diff;
  context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
};
diffFilter.filterName = 'texts';

var patchFilter = function textsPatchFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }

  // text-diff, use a text-patch algorithm
  var patch = getDiffMatchPatch(true).patch;
  context.setResult(patch(context.left, context.delta[0])).exit();
};
patchFilter.filterName = 'texts';

var textDeltaReverse = function(delta) {
  var i, l, lines, line, lineTmp, header = null,
    headerRegex = /^@@ +\-(\d+),(\d+) +\+(\d+),(\d+) +@@$/,
    lineHeader, lineAdd, lineRemove;
  lines = delta.split('\n');
  for (i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    var lineStart = line.slice(0, 1);
    if (lineStart === '@') {
      header = headerRegex.exec(line);
      lineHeader = i;
      lineAdd = null;
      lineRemove = null;

      // fix header
      lines[lineHeader] = '@@ -' + header[3] + ',' + header[4] + ' +' + header[1] + ',' + header[2] + ' @@';
    } else if (lineStart === '+') {
      lineAdd = i;
      lines[i] = '-' + lines[i].slice(1);
      if (lines[i - 1].slice(0, 1) === '+') {
        // swap lines to keep default order (-+)
        lineTmp = lines[i];
        lines[i] = lines[i - 1];
        lines[i - 1] = lineTmp;
      }
    } else if (lineStart === '-') {
      lineRemove = i;
      lines[i] = '+' + lines[i].slice(1);
    }
  }
  return lines.join('\n');
};

var reverseFilter = function textsReverseFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }

  // text-diff, use a text-diff algorithm
  context.setResult([textDeltaReverse(context.delta[0]), 0, TEXT_DIFF]).exit();
};
reverseFilter.filterName = 'texts';

exports.diffFilter = diffFilter;
exports.patchFilter = patchFilter;
exports.reverseFilter = reverseFilter;

},{}],86:[function(require,module,exports){
var isArray = (typeof Array.isArray === 'function') ?
  // use native function
  Array.isArray :
  // use instanceof operator
  function(a) {
    return a instanceof Array;
  };

var diffFilter = function trivialMatchesDiffFilter(context) {
  if (context.left === context.right) {
    context.setResult(undefined).exit();
    return;
  }
  if (typeof context.left === 'undefined') {
    if (typeof context.right === 'function') {
      throw new Error('functions are not supported');
    }
    context.setResult([context.right]).exit();
    return;
  }
  if (typeof context.right === 'undefined') {
    context.setResult([context.left, 0, 0]).exit();
    return;
  }
  if (typeof context.left === 'function' || typeof context.right === 'function') {
    throw new Error('functions are not supported');
  }
  context.leftType = context.left === null ? 'null' : typeof context.left;
  context.rightType = context.right === null ? 'null' : typeof context.right;
  if (context.leftType !== context.rightType) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === 'boolean' || context.leftType === 'number') {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === 'object') {
    context.leftIsArray = isArray(context.left);
  }
  if (context.rightType === 'object') {
    context.rightIsArray = isArray(context.right);
  }
  if (context.leftIsArray !== context.rightIsArray) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
};
diffFilter.filterName = 'trivial';

var patchFilter = function trivialMatchesPatchFilter(context) {
  if (typeof context.delta === 'undefined') {
    context.setResult(context.left).exit();
    return;
  }
  context.nested = !isArray(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult(context.delta[0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    context.setResult(context.delta[1]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult(undefined).exit();
    return;
  }
};
patchFilter.filterName = 'trivial';

var reverseFilter = function trivialReferseFilter(context) {
  if (typeof context.delta === 'undefined') {
    context.setResult(context.delta).exit();
    return;
  }
  context.nested = !isArray(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult([context.delta[0], 0, 0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    context.setResult([context.delta[1], context.delta[0]]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult([context.delta[0]]).exit();
    return;
  }
};
reverseFilter.filterName = 'trivial';

exports.diffFilter = diffFilter;
exports.patchFilter = patchFilter;
exports.reverseFilter = reverseFilter;

},{}],87:[function(require,module,exports){

var environment = require('./environment');

var DiffPatcher = require('./diffpatcher').DiffPatcher;
exports.DiffPatcher = DiffPatcher;

exports.create = function(options){
  return new DiffPatcher(options);
};

exports.dateReviver = require('./date-reviver');

var defaultInstance;

exports.diff = function() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.diff.apply(defaultInstance, arguments);
};

exports.patch = function() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.patch.apply(defaultInstance, arguments);
};

exports.unpatch = function() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.unpatch.apply(defaultInstance, arguments);
};

exports.reverse = function() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.reverse.apply(defaultInstance, arguments);
};

if (environment.isBrowser) {
  exports.homepage = '{{package-homepage}}';
  exports.version = '{{package-version}}';
} else {
  var packageInfoModuleName = '../package.json';
  var packageInfo = require(packageInfoModuleName);
  exports.homepage = packageInfo.homepage;
  exports.version = packageInfo.version;

  var formatterModuleName = './formatters';
  var formatters = require(formatterModuleName);
  exports.formatters = formatters;
  // shortcut for console
  exports.console = formatters.console;
}

},{"./date-reviver":78,"./diffpatcher":79,"./environment":80}],88:[function(require,module,exports){
var Pipe = function Pipe(name) {
  this.name = name;
  this.filters = [];
};

Pipe.prototype.process = function(input) {
  if (!this.processor) {
    throw new Error('add this pipe to a processor before using it');
  }
  var debug = this.debug;
  var length = this.filters.length;
  var context = input;
  for (var index = 0; index < length; index++) {
    var filter = this.filters[index];
    if (debug) {
      this.log('filter: ' + filter.filterName);
    }
    filter(context);
    if (typeof context === 'object' && context.exiting) {
      context.exiting = false;
      break;
    }
  }
  if (!context.next && this.resultCheck) {
    this.resultCheck(context);
  }
};

Pipe.prototype.log = function(msg) {
  console.log('[jsondiffpatch] ' + this.name + ' pipe, ' + msg);
};

Pipe.prototype.append = function() {
  this.filters.push.apply(this.filters, arguments);
  return this;
};

Pipe.prototype.prepend = function() {
  this.filters.unshift.apply(this.filters, arguments);
  return this;
};

Pipe.prototype.indexOf = function(filterName) {
  if (!filterName) {
    throw new Error('a filter name is required');
  }
  for (var index = 0; index < this.filters.length; index++) {
    var filter = this.filters[index];
    if (filter.filterName === filterName) {
      return index;
    }
  }
  throw new Error('filter not found: ' + filterName);
};

Pipe.prototype.list = function() {
  var names = [];
  for (var index = 0; index < this.filters.length; index++) {
    var filter = this.filters[index];
    names.push(filter.filterName);
  }
  return names;
};

Pipe.prototype.after = function(filterName) {
  var index = this.indexOf(filterName);
  var params = Array.prototype.slice.call(arguments, 1);
  if (!params.length) {
    throw new Error('a filter is required');
  }
  params.unshift(index + 1, 0);
  Array.prototype.splice.apply(this.filters, params);
  return this;
};

Pipe.prototype.before = function(filterName) {
  var index = this.indexOf(filterName);
  var params = Array.prototype.slice.call(arguments, 1);
  if (!params.length) {
    throw new Error('a filter is required');
  }
  params.unshift(index, 0);
  Array.prototype.splice.apply(this.filters, params);
  return this;
};

Pipe.prototype.clear = function() {
  this.filters.length = 0;
  return this;
};

Pipe.prototype.shouldHaveResult = function(should) {
  if (should === false) {
    this.resultCheck = null;
    return;
  }
  if (this.resultCheck) {
    return;
  }
  var pipe = this;
  this.resultCheck = function(context) {
    if (!context.hasResult) {
      console.log(context);
      var error = new Error(pipe.name + ' failed');
      error.noResult = true;
      throw error;
    }
  };
  return this;
};

exports.Pipe = Pipe;

},{}],89:[function(require,module,exports){

var Processor = function Processor(options){
  this.selfOptions = options || {};
  this.pipes = {};
};

Processor.prototype.options = function(options) {
  if (options) {
    this.selfOptions = options;
  }
  return this.selfOptions;
};

Processor.prototype.pipe = function(name, pipe) {
  if (typeof name === 'string') {
    if (typeof pipe === 'undefined') {
      return this.pipes[name];
    } else {
      this.pipes[name] = pipe;
    }
  }
  if (name && name.name) {
    pipe = name;
    if (pipe.processor === this) { return pipe; }
    this.pipes[pipe.name] = pipe;
  }
  pipe.processor = this;
  return pipe;
};

Processor.prototype.process = function(input, pipe) {
  var context = input;
  context.options = this.options();
  var nextPipe = pipe || input.pipe || 'default';
  var lastPipe, lastContext;
  while (nextPipe) {
    if (typeof context.nextAfterChildren !== 'undefined') {
      // children processed and coming back to parent
      context.next = context.nextAfterChildren;
      context.nextAfterChildren = null;
    }

    if (typeof nextPipe === 'string') {
      nextPipe = this.pipe(nextPipe);
    }
    nextPipe.process(context);
    lastContext = context;
    lastPipe = nextPipe;
    nextPipe = null;
    if (context) {
      if (context.next) {
        context = context.next;
        nextPipe = lastContext.nextPipe || context.pipe || lastPipe;
      }
    }
  }
  return context.hasResult ? context.result : undefined;
};

exports.Processor = Processor;

},{}],90:[function(require,module,exports){
(function (global){
/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {
    if (typeof Object.observe !== 'function' ||
        typeof Array.observe !== 'function') {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    var arr = [];
    Object.observe(test, callback);
    Array.observe(arr, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 5)
      return false;

    if (records[0].type != 'add' ||
        records[1].type != 'update' ||
        records[2].type != 'delete' ||
        records[3].type != 'splice' ||
        records[4].type != 'splice') {
      return false;
    }

    Object.unobserve(test, callback);
    Array.unobserve(arr, callback);

    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (typeof navigator != 'undefined' && navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0 && s !== '';
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  };

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  };

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar;
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, defaultValue) {
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (obj == null || !(key in obj))
          return defaultValue;
        obj = obj[key];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[i]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n    ' + pathString + ' != null';
      }

      key = this[i];
      var keyIsIdent = isIdent(key);
      var keyForInOperator = keyIsIdent ? '"' + key.replace(/"/g, '\\"') + '"' : key;
      str += ' &&\n    ' + keyForInOperator + ' in ' + pathString + ')\n';
      pathString += keyIsIdent ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return defaultValue;';
      return new Function('obj', 'defaultValue', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};
    var prop;

    for (prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    return function(fn) {
      return Promise.resolve().then(fn);
    };
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var i, observer;
      for (i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      objects: objects,
      get rootObject() { return rootObj; },
      set rootObject(value) {
        rootObj = value;
        rootObjProps = {};
      },
      open: function(obs, object) {
        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
        if (lastObservedSet === this)
          lastObservedSet = null;
      },
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.rootObject !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.rootObject = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  };

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        this.directObserver_ = getObservedObject(this, this.value_,
                                                 this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      }
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path, defaultValue) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.defaultValue_ = defaultValue;
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_, this.defaultValue_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i];
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i];
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe);
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  };

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    var prop;
    for (prop in added)
      added[prop] = object[prop];

    for (prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      var i, j;

      // "Addition" rows. Initialize null column.
      for (i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (i = 1; i < rowCount; i++) {
        for (j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      var splice;
      if (currentStart == currentEnd) {
        splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return;
      }

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  // Export the observe-js object for **Node.js**, with backwards-compatibility
  // for the old `require()` API. Also ensure `exports` is not a DOM Element.
  // If we're in the browser, export as a global object.

  var expose = global;

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports;
    }
    expose = exports;
  }

  expose.Observer = Observer;
  expose.Observer.runEOM_ = runEOM;
  expose.Observer.observerSentinel_ = observerSentinel; // for testing.
  expose.Observer.hasObjectObserve = hasObserve;
  expose.ArrayObserver = ArrayObserver;
  expose.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  expose.ArraySplice = ArraySplice;
  expose.ObjectObserver = ObjectObserver;
  expose.PathObserver = PathObserver;
  expose.CompoundObserver = CompoundObserver;
  expose.Path = Path;
  expose.ObserverTransform = ObserverTransform;

})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],91:[function(require,module,exports){
'use strict';

module.exports = function(str) {
  return str.trim()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
};

},{}],92:[function(require,module,exports){
// underscore.catenate
// -------------------
// v0.1.1
//
// Copyright (c) 2013-2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.catenate

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  return {
    catenate: function() {
      var methods = arguments;

      return function() {
        var output;
        var context = this;
        var catenateArguments = arguments;

        _.each(methods, function(method) {
          if (method) {
            output = method.apply(context, catenateArguments);
          }
        });

        return output;
      }
    }
  };

}));

},{"underscore":"underscore"}],93:[function(require,module,exports){
// underscore.deepclone
// --------------------
// v0.1.1
//
// Copyright (c) 2013-2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.deepclone

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  return {
    deepClone: function(object) {
      var clone = _.clone(object);

      _.each(clone, function(value, key) {
        if (_.isObject(value)) {
          clone[key] = _.deepClone(value);
        }
      });

      return clone;
    }
  };

}));
},{"underscore":"underscore"}],94:[function(require,module,exports){
// underscore.parse
// ----------------
// v0.1.1
//
// Copyright (c) 2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.parse

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  var isArray = function(value) {
    return value.charAt(0) == '[' && value.charAt(value.length - 1) == ']';
  };

  var isObject = function(value) {
    return value.charAt(0) == '{' && value.charAt(value.length - 1) == '}';
  };

  return {
    parse: function(value) {
      if (value == "") {
        return value;
      } else if (value == "true") {
        value = true;
      } else if (value == "false") {
        value = false;
      } else if (value == "null") {
        value = null;
      } else if (value == "undefined") {
        value = undefined;
      } else if (!isNaN(value) && value != "") {
        value = parseFloat(value);
      } else if (isArray(value) || isObject(value)) {
        try {
          value = JSON.parse(value);
        } catch (exception) { }
      }

      return value;
    }
  };

}));
},{"underscore":"underscore"}],95:[function(require,module,exports){
// underscore.path
// ---------------
// v0.1.4
//
// Copyright (c) 2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.path

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  return {
    path: function(context, key) {
      var paths = key.split('.');
      var object = context[paths.shift()];

      _.each(paths, function(key) {
        object = object[key];
      });

      return object;
    }
  };

}));

},{"underscore":"underscore"}],96:[function(require,module,exports){
// underscore.pathextend
// ---------------------
// v0.1.2
//
// Copyright (c) 2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.pathextend

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    _.mixin(require('underscore.path'));
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  return {
    pathExtend: function(object) {
      _.each([].splice.apply(arguments, [1]), function(source) {
        if (source) {
          for (var key in source) {
            var paths = key.split(".");

            if (paths.length == 1) {
              object[key] = source[key];
            } else {
              var property = paths.pop();
              _.path(object, paths.join("."))[property] = source[key];
            }
          }
        }
      });

      return object;
    }
  };

}));

},{"underscore":"underscore","underscore.path":95}],97:[function(require,module,exports){
// underscore.prefilter
// --------------------
// v0.1.2
//
// Copyright (c) 2013-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/underscore.prefilter

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(_);
    exports = factory(_);
  } else {
    root._.mixin(factory(root._));
  }

}(this, function(_) {

  return {
    prefilter: function(method, filter) {
      return function() {
        if (filter.apply(this, arguments)) {
          return method.apply(this, arguments);
        }
      };
    }
  };

}));

},{"underscore":"underscore"}],"handlebars":[function(require,module,exports){
module.exports = window.Handlebars;

},{}],"jquery":[function(require,module,exports){
module.exports = window.jQuery || window.$;

},{}],"underscore":[function(require,module,exports){
module.exports = window._;

},{}]},{},[25]);
