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
