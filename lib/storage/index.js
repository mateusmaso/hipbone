(function() {
  var Module, Storage, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("underscore");

  Module = require("./../module");

  module.exports = Storage = (function(superClass) {
    extend(Storage, superClass);

    function Storage(prefix) {
      if (prefix == null) {
        prefix = "hipbone_";
      }
      this.prefix = prefix;
    }

    Storage.prototype.match = function(regex) {
      var key, matches, value;
      matches = {};
      for (key in localStorage) {
        value = localStorage[key];
        if (regex.test(key) && key.indexOf(this.prefix) >= 0) {
          matches[key.replace(this.prefix, "")] = _.parse(value).data;
        }
      }
      return matches;
    };

    Storage.prototype.get = function(key) {
      var value;
      if (value = localStorage["" + this.prefix + key]) {
        return _.parse(value).data;
      }
    };

    Storage.prototype.set = function(key, value) {
      return localStorage.setItem("" + this.prefix + key, JSON.stringify({
        data: value,
        timestamp: _.now()
      }));
    };

    Storage.prototype.unset = function(key) {
      return localStorage.removeItem("" + this.prefix + key);
    };

    Storage.prototype.clear = function() {
      var key, ref, regex, results, value;
      regex = new RegExp(this.prefix);
      ref = this.match(regex);
      results = [];
      for (key in ref) {
        value = ref[key];
        results.push(this.unset(key));
      }
      return results;
    };

    Storage.register("Storage");

    return Storage;

  })(Module);

}).call(this);
