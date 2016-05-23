Model = require "./../model"

module.exports =

  countAttribute: "count"

  initializeMeta: (meta={}) ->
    @meta = new (Model.define(defaults: @defaults, url: @metaUrl, parse: @metaParse))(meta)
    @listenTo @meta, "all", (eventName, args...) => @trigger.apply(this, ["meta:#{eventName}", args...])
    @on("add", @incrementCounter)
    @on("remove", @decrementCounter)

  metaUrl: =>
    @url()

  metaParse: (response) ->
    response.meta

  incrementCounter: (model, collection, options={}) ->
    @meta.set(@countAttribute, @meta.get(@countAttribute) + 1) if @meta.has(@countAttribute) and not options.parse

  decrementCounter: (model, collection, options={}) ->
    @meta.set(@countAttribute, @meta.get(@countAttribute) - 1) if @meta.has(@countAttribute) and not options.parse
