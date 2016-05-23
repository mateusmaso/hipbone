(function() {
  var Collection, Handlebars, Model, _, diffPatcher, jsondiffpatch;

  _ = require("underscore");

  Handlebars = require("handlebars");

  jsondiffpatch = require("jsondiffpatch");

  Model = require("./../model");

  Collection = require("./../collection");

  diffPatcher = jsondiffpatch.create({
    objectHash: function(object) {
      return (object != null ? object.cid : void 0) || object;
    }
  });

  module.exports = {
    initializeContext: function() {
      return this._context = {};
    },
    context: function() {
      return {};
    },
    getContext: function(context, rootContext) {
      if (context == null) {
        context = {};
      }
      rootContext || (rootContext = this._context);
      context = _.isEmpty(context) ? rootContext : context;
      context.view = this;
      return context;
    },
    presentContext: function(context) {
      var key, ref, value;
      if (context == null) {
        context = {};
      }
      context.view = this;
      ref = context = _.defaults(context, this.properties.attributes);
      for (key in ref) {
        value = ref[key];
        if (value instanceof Model || value instanceof Collection) {
          context[key] = value.toJSON();
        }
      }
      return context;
    },
    mergeContext: function(context) {
      if (context == null) {
        context = {};
      }
      return diffPatcher.patch(this._context, diffPatcher.diff(this._context, context));
    },
    updateContextBindings: function() {
      this.mergeContext(this.presentContext(this.context()));
      return Handlebars.update();
    }
  };

}).call(this);
