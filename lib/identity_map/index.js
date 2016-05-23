(function() {
  var IdentityMap, Module, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Module = require("./../module");

  module.exports = IdentityMap = (function(superClass) {
    extend(IdentityMap, superClass);

    function IdentityMap() {
      this.instances = {};
    }

    IdentityMap.prototype.match = function(regex) {
      var instance, key, matches, ref;
      matches = {};
      ref = this.instances;
      for (key in ref) {
        instance = ref[key];
        if (regex.test(key)) {
          matches[key] = instance;
        }
      }
      return matches;
    };

    IdentityMap.prototype.find = function(key) {
      var value;
      if (value = this.instances[key]) {
        this.store(key, value);
      }
      return value;
    };

    IdentityMap.prototype.findAll = function(keys) {
      var i, key, len, value, values;
      values = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        if (value = this.find(key)) {
          values.push(value);
        }
      }
      return values;
    };

    IdentityMap.prototype.store = function(key, value, options) {
      if (options == null) {
        options = {};
      }
      return this.instances[key] = value;
    };

    IdentityMap.prototype.storeAll = function(keys, value) {
      var i, key, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(this.store(key, value));
      }
      return results;
    };

    IdentityMap.prototype["delete"] = function(key) {
      return delete this.instances[key];
    };

    IdentityMap.prototype.deleteAll = function(keys) {
      var i, key, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(this["delete"](key));
      }
      return results;
    };

    IdentityMap.prototype.clear = function() {
      return this.deleteAll(_.keys(this.instances));
    };

    IdentityMap.register("IdentityMap");

    return IdentityMap;

  })(Module);

}).call(this);
