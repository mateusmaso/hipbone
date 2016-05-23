(function() {
  require("jquery.lifecycle");

  require("handlebars.binding");

  _.mixin(require("underscore.path"));

  _.mixin(require("underscore.pathextend"));

  _.mixin(require("underscore.parse"));

  _.mixin(require("underscore.prefilter"));

  _.mixin(require("underscore.catenate"));

  _.mixin(require("underscore.deepclone"));

  window.Hipbone = {
    VERSION: '2.0.1',
    I18n: require("./i18n"),
    View: require("./view"),
    Model: require("./model"),
    Route: require("./route"),
    Module: require("./module"),
    Router: require("./router"),
    History: require("./history"),
    Storage: require("./storage"),
    Collection: require("./collection"),
    Application: require("./application"),
    IdentityMap: require("./identity_map")
  };

}).call(this);
