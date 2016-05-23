(function() {
  var Backbone, _,
    slice = [].slice;

  Backbone = require("backbone");

  _ = require("underscore");

  module.exports = {
    initializeAjax: function() {
      this.host || (this.host = "");
      return this.headers || (this.headers = {});
    },
    ajax: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxHandle(Backbone.ajax(this.ajaxSettings(options)));
    },
    ajaxHandle: function(xhr) {
      xhr.done((function(_this) {
        return function() {
          return _this.trigger.apply(_this, ["ajaxSuccess"].concat(slice.call(arguments)));
        };
      })(this));
      xhr.fail((function(_this) {
        return function() {
          return _this.trigger.apply(_this, ["ajaxError"].concat(slice.call(arguments)));
        };
      })(this));
      return xhr;
    },
    ajaxUrl: function(url) {
      return "" + this.host + url;
    },
    ajaxHeaders: function() {
      var header, headers, ref, value;
      headers = {};
      ref = this.headers;
      for (header in ref) {
        value = ref[header];
        if (_.isFunction(value)) {
          value = value.apply(this);
        }
        headers[header] = value;
      }
      return headers;
    },
    ajaxSettings: function(options) {
      if (options == null) {
        options = {};
      }
      options.url = this.ajaxUrl(options.url);
      options.headers = _.extend({}, options.headers, this.ajaxHeaders());
      if (options.type === 'POST') {
        options.dataType = 'json';
        options.contentType = 'application/json';
        if (options.data) {
          options.data = JSON.stringify(options.data);
        }
      }
      options.beforeSend = _.catenate(function(xhr, settings) {
        if (settings == null) {
          settings = {};
        }
        return xhr.settings = settings;
      }, options.beforeSend);
      return options;
    }
  };

}).call(this);
