module.exports =

  initializeMeta: (meta={}) ->
    @meta = new (Hipbone.Model.define(defaults: @defaults))(meta)
    @listenTo @meta, "all", (eventName, args...) => @trigger.apply(this, ["meta:#{eventName}", args...])
