(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Hipbone.I18n = (function(superClass) {
    extend(I18n, superClass);

    function I18n(locale, splitter) {
      this.locale = locale;
      this.splitter = splitter || /{{\w+}}/g;
    }

    I18n.prototype.interpolate = function(text, values) {
      var i, len, match, ref, value;
      if (values == null) {
        values = {};
      }
      ref = text.match(this.splitter) || [];
      for (i = 0, len = ref.length; i < len; i++) {
        match = ref[i];
        value = values[match.replace(/\W/g, "")];
        text = text.replace(match, value);
      }
      return text;
    };

    I18n.prototype.pluralize = function(key, count) {
      if (count === 0) {
        key = key + ".zero";
      } else if (count === 1) {
        key = key + ".one";
      } else {
        key = key + ".other";
      }
      return _.path(this.locale, key);
    };

    I18n.prototype.inflector = function(key, gender) {
      if (gender === 'm') {
        key = key + ".male";
      } else if (gender === 'f') {
        key = key + ".female";
      } else {
        key = key + ".neutral";
      }
      return _.path(this.locale, key);
    };

    I18n.prototype.translate = function(key, options) {
      var text;
      if (options == null) {
        options = {};
      }
      if (_.has(options, 'count')) {
        text = this.pluralize(key, options.count);
      } else if (_.has(options, 'gender')) {
        text = this.inflector(key, options.gender);
      } else {
        text = _.path(this.locale, key);
      }
      return this.interpolate(text, options);
    };

    I18n.prototype.t = I18n.prototype.translate;

    return I18n;

  })(Hipbone.Module);

}).call(this);
