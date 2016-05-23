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
