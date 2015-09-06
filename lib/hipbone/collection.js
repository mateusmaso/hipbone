(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Collection = (function(superClass) {
    extend(Collection, superClass);

    Collection.include(Hipbone.Accessor);

    Collection.include(Hipbone.Filter);

    Collection.include(Hipbone.Pagination);

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
        accessors: options.meta
      });
      this.initializeFilter(options.filters);
      this.initializePagination(options.pagination);
      Collection.__super__.constructor.apply(this, arguments);
      this.on("add remove reset sort", (function(_this) {
        return function() {
          return _this.trigger("update", _this);
        };
      })(this));
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

    Collection.prototype.url = function(options) {
      var queryParams, url;
      queryParams = this.filterJSON(options);
      url = this.parent ? this.parent.url(options) + this.urlRoot : this.urlRoot;
      if (!_.isEmpty(queryParams)) {
        url = url + "?" + ($.param(queryParams));
      }
      return url;
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
