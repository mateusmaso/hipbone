(function() {
  Hipbone.Application.prototype.initializers.push(function() {
    var parseValue;
    parseValue = Handlebars.parseValue;
    return Handlebars.parseValue = (function(_this) {
      return function(value, bool) {
        var model;
        value = parseValue.apply(_this, [value, bool]);
        if (value && (model = _this.identityMap.find(value.cid))) {
          value = model;
        }
        return value;
      };
    })(this);
  });

}).call(this);
