Model = require "./../model"

module.exports =

  initializeMeta: (meta={}) ->
    @meta = new (Model.define(defaults: @defaults))(meta)
    @listenTo @meta, "all", (eventName, args...) => @trigger.apply(this, ["meta:#{eventName}", args...])
