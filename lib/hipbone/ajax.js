(function() {
  var slice = [].slice;

  Hipbone.Ajax = {
    initializeAjax: function(host, headers) {
      this.host || (this.host = host || '');
      return this.headers || (this.headers = headers || {});
    },
    ajax: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxHandle($.ajax(this.ajaxSettings(options)));
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
    ajaxSettings: function(options) {
      var header, ref, value;
      if (options == null) {
        options = {};
      }
      options.url = this.host + options.url;
      if (options.type === 'POST') {
        options.dataType = 'json';
        options.contentType = 'application/json';
        options.data = JSON.stringify(options.data);
      }
      options.headers || (options.headers = {});
      ref = this.headers;
      for (header in ref) {
        value = ref[header];
        if (_.isFunction(value)) {
          value = value.apply(this);
        }
        options.headers[header] = value;
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
