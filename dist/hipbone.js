// hipbone
// ------------------
// v1.0.0
//
// Copyright (c) 2012-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/hipbone

(function() {
  window.Hipbone = {
    VERSION: '1.0.0'
  };

}).call(this);

(function() {
  var slice = [].slice;

  Hipbone.Ajax = {
    initializeAjax: function(host, headers) {
      this.host || (this.host = host || '');
      return this.headers || (this.headers = headers || {});
    },
    ajax: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxHandle($.ajax(this.ajaxSettings(options)));
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
      options.url = this.host + options.url;
      if (options.type === 'POST') {
        options.dataType = 'json';
        options.contentType = 'application/json';
        options.data = JSON.stringify(options.data);
      }
      options.headers || (options.headers = {});
      ref = this.headers;
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

(function() {
  var i, len, module, ref,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Hipbone.Module = (function() {
    var moduleKeywords;

    function Module() {}

    moduleKeywords = ['included', 'extended'];

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

  ref = ['Model', 'Collection', 'Router', 'View', 'History'];
  for (i = 0, len = ref.length; i < len; i++) {
    module = ref[i];
    Backbone[module] = _.extend(Backbone[module], Hipbone.Module);
    Backbone[module].prototype = _.extend(Backbone[module].prototype, Hipbone.Module.prototype);
  }

}).call(this);

(function() {
  Hipbone.Mapping = {
    initializeMapping: function(mappings, polymorphics) {
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

(function() {
  Hipbone.Accessor = {
    initializeAccessor: function(options) {
      var alias, name, name1, name2, name3, name4;
      if (options == null) {
        options = {};
      }
      this.defaults || (this.defaults = {});
      this.accessorName || (this.accessorName = options.accessorName || "");
      this.accessorsName || (this.accessorsName = options.accessorsName || "");
      this.accessorEvent || (this.accessorEvent = options.accessorEvent || "change");
      this.accessors = this[this.accessorsName] = {};
      this.setAccessor(_.defaults({}, options.accessors, this.defaults, options.defaults), {
        silent: true
      });
      if (this.accessorName) {
        alias = _.string.capitalize(this.accessorName);
      } else {
        alias = "";
      }
      this[name = "get" + alias] || (this[name] = this.getAccessor);
      this[name1 = "set" + alias] || (this[name1] = this.setAccessor);
      this[name2 = "unset" + alias] || (this[name2] = this.unsetAccessor);
      this[name3 = "changed" + alias] || (this[name3] = this.changedAccessors);
      return this[name4 = "previous" + alias] || (this[name4] = this.previousAccessor);
    },
    getAccessor: function(accessor) {
      return _.path(this.accessors, accessor);
    },
    setAccessor: function(accessor, value, options) {
      var accessors, i, len, path, paths, ref, ref1;
      if (options == null) {
        options = {};
      }
      if (_.isObject(accessor)) {
        accessors = accessor;
        options = value || {};
      } else {
        accessors = {};
        accessors[accessor] = value;
      }
      this._previousAccessors = _.clone(this.accessors);
      this._changedAccessors = this.changedAccessors(accessors);
      if (!_.isEmpty(this._changedAccessors)) {
        this.accessors = _.pathExtend(this.accessors, this._changedAccessors);
        if (!options.silent) {
          ref = this._changedAccessors;
          for (accessor in ref) {
            value = ref[accessor];
            paths = accessor.split(".");
            ref1 = _.clone(paths).reverse();
            for (i = 0, len = ref1.length; i < len; i++) {
              path = ref1[i];
              accessor = paths.join(".");
              paths.pop();
              this.trigger(this.accessorEvent + ":" + accessor, this, _.path(this._previousAccessors, accessor), options);
            }
          }
          this.trigger(this.accessorEvent, this, accessors, options);
        }
        return delete this._previousAccessors;
      }
    },
    unsetAccessor: function(accessor, options) {
      if (options == null) {
        options = {};
      }
      return this.setAccessor(accessor, void 0, options);
    },
    previousAccessor: function(accessor) {
      if (this._previousAccessors) {
        return this._previousAccessors[accessor];
      }
    },
    changedAccessors: function(accessors) {
      var accessor, changed, value;
      changed = {};
      for (accessor in accessors) {
        value = accessors[accessor];
        if (!_.isEqual(this.getAccessor(accessor), value)) {
          changed[accessor] = value;
        }
      }
      return changed;
    }
  };

}).call(this);

(function() {
  Hipbone.Validation = {
    initializeValidation: function(validations) {
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

(function() {
  Hipbone.ComputedAttribute = {
    initializeComputedAttribute: function(computedAttributes) {
      if (computedAttributes == null) {
        computedAttributes = {};
      }
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
      json = {};
      for (i = 0, len = computedAttributes.length; i < len; i++) {
        computedAttribute = computedAttributes[i];
        json[computedAttribute] = this.getComputedAttribute(computedAttribute);
      }
      return json;
    }
  };

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Model = (function(superClass) {
    extend(Model, superClass);

    Model.include(Hipbone.Mapping);

    Model.include(Hipbone.Validation);

    Model.include(Hipbone.ComputedAttribute);

    Model.prototype.hashName = "model";

    Model.prototype.typeAttribute = "type";

    function Model(attributes, options) {
      var hashes, model;
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = this.hashes(attributes);
      if (model = Hipbone.app.identityMap.findAll(hashes)[0]) {
        model.set(attributes, options);
        return model;
      } else {
        this.store(hashes);
      }
      this.initializeMapping();
      this.initializeValidation();
      this.initializeComputedAttribute();
      Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.get = function(attribute) {
      if (this.mappings[attribute] || _.contains(this.polymorphics, attribute)) {
        return this.getMapping(attribute);
      } else if (this.computedAttributes[attribute]) {
        return this.getComputedAttribute(attribute);
      } else {
        return _.path(this.attributes, attribute);
      }
    };

    Model.prototype.set = function(attribute, value, options) {
      var attributes, changed, i, len, nestedAttributes, onChange, path, paths, previousAttribute, ref, ref1;
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
      this.type = attributes[this.typeAttribute] || this.type;
      ref = _.pick(attributes, _.keys(this.mappings), this.polymorphics);
      for (attribute in ref) {
        value = ref[attribute];
        this.setMapping(attribute, value, {
          parse: true
        });
        delete attributes[attribute];
      }
      changed = false;
      onChange = (function(_this) {
        return function() {
          return changed = false;
        };
      })(this);
      for (attribute in attributes) {
        value = attributes[attribute];
        paths = attribute.split(".");
        if (paths.length > 1) {
          value = attributes[attribute];
          delete attributes[attribute];
          if (!_.isEqual(this.get(attribute), value)) {
            nestedAttributes = {};
            nestedAttributes[attribute] = value;
            previousAttribute = this.get(attribute);
            this.attributes = _.pathExtend(this.attributes, nestedAttributes);
            if (!options.silent) {
              ref1 = _.clone(paths).reverse();
              for (i = 0, len = ref1.length; i < len; i++) {
                path = ref1[i];
                attribute = paths.join(".");
                paths.pop();
                changed = true;
                this.trigger("change:" + attribute, this, previousAttribute, options);
              }
            }
          }
        }
      }
      this.on("change", onChange);
      Model.__super__.set.call(this, attributes, options);
      this.off("change", onChange);
      if (changed) {
        this.trigger('change', this, options);
      }
      return this.store();
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

    Model.prototype.hashes = function(attributes) {
      var hashes;
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      if (attributes[this.idAttribute]) {
        hashes.push(this.hashName + "-" + attributes[this.idAttribute]);
      }
      return hashes;
    };

    Model.prototype.parse = function(response) {
      if (response == null) {
        response = {};
      }
      this.synced = Date.now();
      return response;
    };

    Model.prototype.prepare = function() {
      return $.when(this.synced || this.fetch());
    };

    Model.prototype.unsync = function() {
      delete this.synced;
      return this.trigger('unsync', this);
    };

    Model.prototype.store = function(hashes) {
      hashes || (hashes = this.hashes(this.attributes));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    };

    return Model;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Application = (function(superClass) {
    extend(Application, superClass);

    Application.include(Hipbone.Ajax);

    Application.include(Hipbone.Accessor);

    Application.include(Backbone.Events);

    Application.prototype.locales = {};

    Application.prototype.initializers = [];

    function Application(options) {
      var i, initializer, len, ref;
      if (options == null) {
        options = {};
      }
      Hipbone.app = this;
      this.views || (this.views = options.views || {});
      this.title || (this.title = options.title || 'App');
      this.locale || (this.locale = options.local || 'en');
      this.models || (this.models = options.models || {});
      this.assets || (this.assets = options.assets || {});
      this.routes || (this.routes = options.routes || {});
      this.matches || (this.matches = options.matches || []);
      this.templates || (this.templates = options.templates || {});
      this.collections || (this.collections = options.collections || {});
      this.templatePath || (this.templatePath = options.templatePath || '');
      if (options.locales) {
        this.locales = options.locales;
      }
      if (options.initializers) {
        this.initializers = options.initializers;
      }
      this.i18n = new Hipbone.I18n(this.locales[this.locale]);
      this.router = new Hipbone.Router({
        matches: this.matches
      });
      this.storage = new Hipbone.Storage;
      this.identityMap = new Hipbone.IdentityMap;
      this.initializeAccessor({
        accessorsName: "attributes",
        accessors: options.attributes
      });
      this.initializeAjax(options.host, options.headers);
      this.initialize(options);
      ref = this.initializers;
      for (i = 0, len = ref.length; i < len; i++) {
        initializer = ref[i];
        initializer.apply(this, [options]);
      }
    }

    Application.prototype.initialize = function() {};

    Application.prototype.run = function() {
      return this.trigger('run');
    };

    return Application;

  })(Hipbone.Module);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Collection = (function(superClass) {
    extend(Collection, superClass);

    Collection.include(Hipbone.Accessor);

    Collection.prototype.model = Hipbone.Model;

    Collection.prototype.hashName = "collection";

    function Collection(models, options) {
      var collection, hashes;
      if (options == null) {
        options = {};
      }
      if (!_.isArray(models)) {
        options = models || {};
        models = void 0;
      }
      hashes = this.hashes(models, options);
      if (collection = Hipbone.app.identityMap.findAll(hashes)[0]) {
        if (models) {
          collection.set(models, options);
        }
        if (options.meta) {
          collection.setMeta(options.meta);
        }
        if (options.parent) {
          collection.parent = options.parent;
        }
        return collection;
      } else {
        this.store(hashes);
      }
      this.cid = _.uniqueId('col');
      this.parent = options.parent;
      this.initializeAccessor({
        accessorName: "meta",
        accessorsName: "meta",
        accessorEvent: "change:meta",
        accessors: options.meta,
        defaults: {
          offset: 0,
          limit: 10
        }
      });
      Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype._prepareModel = function(attributes, options) {
      if (options == null) {
        options = {};
      }
      if (!this._isModel(attributes)) {
        attributes = new (Hipbone.app.models[this.parseModelType(attributes)] || this.model)(attributes, options);
      }
      return Collection.__super__._prepareModel.apply(this, arguments);
    };

    Collection.prototype.modelId = function(attributes) {
      var Model;
      if (this.model && this._isModel(this.model.prototype)) {
        Model = this.model;
      } else {
        Model = Hipbone.app.models[this.parseModelType(attributes)];
      }
      if (attributes[Model.prototype.idAttribute]) {
        return attributes[Model.prototype.typeAttribute] + "-" + attributes[Model.prototype.idAttribute];
      } else {
        return Collection.__super__.modelId.apply(this, arguments);
      }
    };

    Collection.prototype.url = function() {
      if (this.parent) {
        return this.parent.url() + this.urlRoot;
      } else {
        return this.urlRoot;
      }
    };

    Collection.prototype.set = function(models, options) {
      if (options == null) {
        options = {};
      }
      Collection.__super__.set.call(this, models, options);
      return this.store();
    };

    Collection.prototype.setAccessor = function() {
      Hipbone.Accessor.setAccessor.apply(this, arguments);
      return this.store();
    };

    Collection.prototype.fetch = function(options) {
      var key, ref, value;
      if (options == null) {
        options = {};
      }
      options.data || (options.data = {});
      ref = this.meta;
      for (key in ref) {
        value = ref[key];
        if (value != null) {
          options.data[key] = value;
        }
      }
      if (options.increment) {
        this.setMeta({
          offset: this.getMeta('offset') + this.getMeta('limit')
        });
        options.data.offset = this.getMeta("offset");
      } else {
        options.data.offset = 0;
        options.data.limit = this.getMeta("offset") + this.getMeta("limit");
      }
      return Collection.__super__.fetch.call(this, options);
    };

    Collection.prototype.fetchMore = function(options) {
      if (options == null) {
        options = {};
      }
      return this.fetch(_.extend({
        remove: false,
        increment: true
      }, options));
    };

    Collection.prototype.hasMore = function() {
      return this.length === (this.getMeta('offset') + this.getMeta('limit'));
    };

    Collection.prototype.toJSON = function(options) {
      var json;
      if (options == null) {
        options = {};
      }
      json = Collection.__super__.toJSON.apply(this, arguments);
      if (!options.sync) {
        json = _.extend(_.deepClone(this.meta), {
          length: this.length,
          cid: this.cid,
          models: json
        });
      }
      return json;
    };

    Collection.prototype.hashes = function(models, options) {
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
    };

    Collection.prototype.parse = function(response) {
      if (response == null) {
        response = {};
      }
      this.synced = Date.now();
      this.setMeta(response.meta);
      return response.models || response;
    };

    Collection.prototype.parseModelType = function(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      return attributes.type;
    };

    Collection.prototype.prepare = function() {
      return $.when(this.synced || this.fetch());
    };

    Collection.prototype.unsync = function() {
      delete this.synced;
      return this.trigger('unsync', this);
    };

    Collection.prototype.store = function(hashes) {
      hashes || (hashes = this.hashes(this.models, {
        parent: this.parent,
        meta: this.meta
      }));
      return Hipbone.app.identityMap.storeAll(hashes, this);
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);

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

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.I18n = (function(superClass) {
    extend(I18n, superClass);

    function I18n(locale, splitter) {
      this.locale = locale;
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
      return _.path(this.locale, key);
    };

    I18n.prototype.inflector = function(key, gender) {
      if (gender === 'm') {
        key = key + ".male";
      } else if (gender === 'f') {
        key = key + ".female";
      } else {
        key = key + ".neutral";
      }
      return _.path(this.locale, key);
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
        text = _.path(this.locale, key);
      }
      return this.interpolate(text, options);
    };

    I18n.prototype.t = I18n.prototype.translate;

    return I18n;

  })(Hipbone.Module);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.IdentityMap = (function(superClass) {
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

    return IdentityMap;

  })(Hipbone.Module);

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    var Collection, Model, Route, View, booleans, key, method, name, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, setReflection, value;
    setReflection = function(Module, attribute, value) {
      if ((Module.prototype[attribute] == null) || _.isEqual(Module.__super__[attribute], Module.prototype[attribute])) {
        return Module.prototype[attribute] = value;
      }
    };
    ref = _.pick(this.constructor, _.functions(this.constructor));
    for (name in ref) {
      method = ref[name];
      if (method.prototype instanceof Hipbone.View) {
        this.views[name] = method;
      }
      if (method.prototype instanceof Hipbone.Model) {
        this.models[name] = method;
      }
      if (method.prototype instanceof Hipbone.Route) {
        this.routes[name] = method;
      }
      if (method.prototype instanceof Hipbone.Collection) {
        this.collections[name] = method;
      }
    }
    ref1 = this.routes;
    for (name in ref1) {
      Route = ref1[name];
      setReflection(Route, "hashName", _.string.dasherize(name).substring(1));
    }
    ref2 = this.views;
    for (name in ref2) {
      View = ref2[name];
      setReflection(View, "hashName", _.string.dasherize(name).substring(1));
    }
    ref3 = this.models;
    for (name in ref3) {
      Model = ref3[name];
      Model.prototype.defaults = _.extend({}, _.clone(Model.prototype.defaults), {
        type: name
      });
      setReflection(Model, "hashName", _.string.dasherize(name).substring(1));
    }
    ref4 = this.collections;
    for (name in ref4) {
      Collection = ref4[name];
      setReflection(Collection, "hashName", _.string.dasherize(name).substring(1));
    }
    ref5 = this.views;
    results = [];
    for (name in ref5) {
      View = ref5[name];
      booleans = [];
      ref6 = View.prototype.defaults;
      for (key in ref6) {
        value = ref6[key];
        if (_.isBoolean(value)) {
          booleans.push(key);
        }
      }
      setReflection(View, "booleans", booleans);
      results.push(setReflection(View, "elementName", _.string.dasherize(name).substring(1).replace("-view", "")));
    }
    return results;
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return $('body').on("click", "a:not([bypass])", (function(_this) {
      return function(event) {
        var href;
        if (!(event.ctrlKey || event.metaKey) && Hipbone.history.location.hostname === event.currentTarget.hostname) {
          if (!$(event.currentTarget).attr("target") && (href = $(event.currentTarget).attr("href"))) {
            event.preventDefault();
            return _this.router.navigate(href, {
              trigger: true
            });
          }
        }
      };
    })(this));
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
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
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
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
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return $('body').on("submit", "form:not([bypass])", function(event) {
      return event.preventDefault();
    });
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    var View, name, ref, results;
    ref = this.views;
    results = [];
    for (name in ref) {
      View = ref[name];
      results.push((function(name, View) {
        return Handlebars.registerElement(View.prototype.elementName, function(attributes) {
          return new View(attributes, $(this).contents()).el;
        }, {
          booleans: View.prototype.booleans
        });
      })(name, View));
    }
    return results;
  });

}).call(this);

(function() {
  var slice = [].slice;

  Hipbone.Application.prototype.initializers.push(function() {
    var eachHelper, ifHelper;
    Handlebars.registerHelper('asset', function(asset, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.assets[asset];
    });
    Handlebars.registerHelper('t', function(key, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.i18n.t(key, options.hash);
    });
    Handlebars.registerHelper('url', function(name, options) {
      if (options == null) {
        options = {};
      }
      return Hipbone.app.router.buildUrl(name, options.hash);
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
      path = Hipbone.app.templatePath + path;
      context = _.isEmpty(options.hash) ? this : options.hash;
      template = Hipbone.app.templates[path](context);
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
  });

}).call(this);

(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    return this.on("run", function() {
      return this.trigger("start", Hipbone.history.start({
        pushState: true
      }));
    });
  });

}).call(this);

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

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Storage = (function(superClass) {
    extend(Storage, superClass);

    function Storage() {
      return Storage.__super__.constructor.apply(this, arguments);
    }

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

  })(Hipbone.Module);

}).call(this);

(function() {
  var sync;

  sync = Backbone.sync;

  Hipbone.sync = Backbone.sync = function(method, model, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    options.url || (options.url = model.url());
    options = Hipbone.app.ajaxSettings(options);
    return Hipbone.app.ajaxHandle(sync.apply(this, [method, model, options]));
  };

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Hipbone.View = (function(superClass) {
    extend(View, superClass);

    View.include(Hipbone.Accessor);

    View.prototype.hashName = "view";

    View.prototype.elementName = "view";

    function View(properties, content) {
      var hashes, view;
      if (properties == null) {
        properties = {};
      }
      hashes = this.hashes(properties);
      if (view = Hipbone.app.identityMap.findAll(hashes)[0]) {
        view.setContent(content);
        view.set(properties);
        return view;
      } else {
        this.store(hashes);
      }
      this.booleans || (this.booleans = []);
      this.elements || (this.elements = {});
      this.internal = {};
      this.content = content;
      this.classNameBindings || (this.classNameBindings = {});
      this.deferact = _.debounce(this.react);
      this.initializeAccessor({
        accessorsName: "properties",
        accessors: properties
      });
      View.__super__.constructor.apply(this, arguments);
      this.populate();
      this.render();
      this.hooks();
    }

    View.prototype.destroy = function() {};

    View.prototype.insert = function() {};

    View.prototype.detach = function() {};

    View.prototype.change = function(attribute, value) {};

    View.prototype.hooks = function() {
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
    };

    View.prototype.setAccessor = function(accessor, value, options) {
      var ref;
      if (options == null) {
        options = {};
      }
      if (_.isObject(accessor)) {
        options = value || {};
      }
      Hipbone.Accessor.setAccessor.apply(this, arguments);
      if ((ref = this.$el) != null ? ref.is("[lifecycle]") : void 0) {
        this.update(options);
      }
      return this.store();
    };

    View.prototype._ensureElement = function() {
      View.__super__._ensureElement.apply(this, arguments);
      this.set({
        "class": this.el.className + " " + (this.get("class") || '')
      });
      this._setAttributes(this.properties);
      return this.el.hipboneView = this;
    };

    View.prototype.setContent = function(content) {
      if (this.container) {
        this.$(this.container).append(content);
      } else {
        this.$el.append(content);
      }
      return this.content = content;
    };

    View.prototype.setAttribute = function(attribute, value) {
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
      return View.__super__.$.call(this, this.elements[selector] || selector);
    };

    View.prototype.$view = function(selector) {
      if (this.$(selector)[0]) {
        return this.$(selector)[0].hipboneView;
      }
    };

    View.prototype.fetch = function() {};

    View.prototype.synced = function() {};

    View.prototype.populate = function() {
      if (!this.synced()) {
        this.set({
          loading: true
        });
      }
      return this.prepare().done((function(_this) {
        return function() {
          return _this.set({
            loading: false
          });
        };
      })(this));
    };

    View.prototype.prepare = function() {
      if (this.background) {
        return this.fetch();
      } else {
        return $.when(this.synced() || this.fetch());
      }
    };

    View.prototype.context = function() {};

    View.prototype.update = function(options) {
      if (options == null) {
        options = {};
      }
      this.merge(this.present(this.context()));
      if (options.immediate || Object.observe) {
        return this.react();
      } else {
        return this.deferact();
      }
    };

    View.prototype.render = function() {
      this.merge(this.present(this.context()));
      if (this.templateName) {
        this.$el.html(this.template(this.templateName));
      }
      if (this.content) {
        return this.setContent(this.content);
      }
    };

    View.prototype.template = function(path, context) {
      path = Hipbone.app.templatePath + path;
      context = _.isEmpty(context) ? this.internal : this.present(context);
      return $(Handlebars.parseHTML(Hipbone.app.templates[path](context)));
    };

    View.prototype.context = function() {};

    View.prototype.present = function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      ref = context = _.defaults(context, this.properties);
      for (key in ref) {
        value = ref[key];
        if (value instanceof Hipbone.Model || value instanceof Hipbone.Collection) {
          context[key] = value.toJSON();
        }
      }
      return context;
    };

    View.prototype.delegate = function(eventName, selector, listener) {
      selector = this.elements[selector] || selector;
      return View.__super__.delegate.call(this, eventName, selector, listener);
    };

    View.prototype.bubble = function() {
      var args, eventName;
      eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.trigger.apply(this, arguments);
      return this.$el.trigger(eventName, args);
    };

    View.prototype.remove = function() {
      this.destroy();
      return View.__super__.remove.apply(this, arguments);
    };

    View.prototype.hashes = function(properties) {
      var hashes;
      if (properties == null) {
        properties = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      return hashes;
    };

    View.prototype.react = function() {
      var callback, className, oldValue, ref, value;
      this._classNameBindings || (this._classNameBindings = {});
      ref = this.classNameBindings;
      for (className in ref) {
        callback = ref[className];
        oldValue = this._classNameBindings[className];
        value = this._classNameBindings[className] = callback.apply(this);
        if (_.isBoolean(value)) {
          if (value) {
            this.$el.addClass(className);
          } else {
            this.$el.removeClass(className);
          }
        } else if (value !== oldValue) {
          this.$el.removeClass(oldValue);
          this.$el.addClass(value);
        }
      }
      return Platform.performMicrotaskCheckpoint();
    };

    View.prototype.merge = function(context) {
      jsondiffpatch.config.objectHash = function(object) {
        return (object != null ? object.cid : void 0) || object;
      };
      return jsondiffpatch.patch(this.internal, jsondiffpatch.diff(this.internal, context));
    };

    View.prototype.store = function(hashes) {
      hashes || (hashes = this.hashes());
      return Hipbone.app.identityMap.storeAll(hashes, this);
    };

    return View;

  })(Backbone.View);

}).call(this);
