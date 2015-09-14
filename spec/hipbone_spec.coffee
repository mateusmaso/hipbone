if navigator.userAgent.indexOf('PhantomJS') < 0
  chai.Assertion.addProperty 'model', -> @_obj instanceof Hipbone.Model
  chai.Assertion.addProperty 'collection', -> @_obj instanceof Hipbone.Collection

  describe "hipbone", ->
    require("./hipbone/module_spec").apply(this)
    require("./hipbone/i18n_spec").apply(this)
    require("./hipbone/identity_map_spec").apply(this)
    require("./hipbone/storage_spec").apply(this)
    require("./hipbone/application_spec").apply(this)
    require("./hipbone/model_spec").apply(this)
    require("./hipbone/collection_spec").apply(this)
    # require("./hipbone/view_spec").apply(this)
    # require("./hipbone/route_spec").apply(this)
    # require("./hipbone/router_spec").apply(this)
    # require("./hipbone/history_spec").apply(this)
