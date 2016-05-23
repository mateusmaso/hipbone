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
