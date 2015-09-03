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
      if (options == null) {
        options = {};
      }
      if (options.sync) {
        return Collection.__super__.toJSON.apply(this, arguments);
      } else {
        return _.extend(_.deepClone(this.meta), {
          length: this.length,
          cid: this.cid,
          models: Collection.__super__.toJSON.apply(this, arguments)
        });
      }
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
