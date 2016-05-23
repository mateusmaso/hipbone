(function() {
  var Collection, Handlebars, Model;

  Handlebars = require("handlebars");

  Model = require("./../../model");

  Collection = require("./../../collection");

  module.exports = function() {
    var parseValue;
    parseValue = Handlebars.parseValue;
    return Handlebars.parseValue = function(value, bool) {
      var model;
      value = parseValue.apply(this, [value, bool]);
      if (value && (model = Model.identityMap.find(value.cid) || Collection.identityMap.find(value.cid))) {
        value = model;
      }
      return value;
    };
  };

}).call(this);
