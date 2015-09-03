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
