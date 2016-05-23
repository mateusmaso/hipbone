(function() {
  var IdentityMap, _, dasherize;

  _ = require("underscore");

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
    initializeStore: function(params, options) {
      var hashes, route;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = this.hashes(params, options);
      if (this.identityMap.find(options.pathname) && !options.popstate) {
        hashes = _.without(hashes, options.pathname);
      }
      if (route = this.identityMap.findAll(hashes)[0]) {
        route.set(route.parse(params));
        return route;
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
    hashes: function(params, options) {
      var hashes;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      hashes = [];
      if (this.cid) {
        hashes.push(this.cid);
      }
      hashes.push(options.pathname);
      return hashes;
    },
    store: function(hashes) {
      hashes || (hashes = this.hashes(this.params.attributes));
      return this.identityMap.storeAll(hashes, this);
    }
  };

}).call(this);
