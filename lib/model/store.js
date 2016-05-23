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
