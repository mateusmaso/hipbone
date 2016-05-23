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
