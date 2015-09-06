(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Model = (function(superClass) {
    extend(Model, superClass);

    Model.include(Hipbone.Filter);

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
      this.initializeFilter(options.filters);
      this.initializeMapping(options.mappings, options.polymorphics);
      this.initializeValidation(options.validations);
      this.initializeComputedAttribute(options.computedAttributes);
      Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.url = function(options) {
      var queryParams, url;
      queryParams = this.filterJSON(options);
      url = Model.__super__.url.apply(this, arguments);
      if (!_.isEmpty(queryParams)) {
        url = url + "?" + ($.param(queryParams));
      }
      return url;
    };

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
