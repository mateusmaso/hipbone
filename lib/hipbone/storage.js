(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.Storage = (function(superClass) {
    extend(Storage, superClass);

    function Storage() {
      return Storage.__super__.constructor.apply(this, arguments);
    }

    Storage.prototype.match = function(regex) {
      var key, matches, value;
      matches = {};
      for (key in localStorage) {
        value = localStorage[key];
        if (regex.test(key)) {
          matches[key] = JSON.parse(value);
        }
      }
      return matches;
    };

    Storage.prototype.get = function(key) {
      var value;
      if (value = localStorage[key]) {
        return _.parse(value);
      }
    };

    Storage.prototype.set = function(key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.unset = function(key) {
      return localStorage.removeItem(key);
    };

    return Storage;

  })(Hipbone.Module);

}).call(this);
