(function() {
  Hipbone.ComputedAttribute = {
    initializeComputedAttribute: function(computedAttributes) {
      if (computedAttributes == null) {
        computedAttributes = {};
      }
      return this.computedAttributes = _.extend({}, this.computedAttributes, computedAttributes);
    },
    getComputedAttribute: function(attribute) {
      var method;
      method = this.computedAttributes[attribute];
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        return method.apply(this);
      }
    },
    setComputedAttribute: function(attribute, value) {
      var method;
      method = this.computedAttributes[attribute];
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        return method.apply(this, [value]);
      }
    },
    toJSONComputedAttributes: function(computedAttributes) {
      var computedAttribute, i, json, len;
      json = {};
      for (i = 0, len = computedAttributes.length; i < len; i++) {
        computedAttribute = computedAttributes[i];
        json[computedAttribute] = this.getComputedAttribute(computedAttribute);
      }
      return json;
    }
  };

}).call(this);
