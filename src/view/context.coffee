_ = require "underscore"
Handlebars = require "handlebars"
jsondiffpatch = require "jsondiffpatch"
Model = require "./../model"
Collection = require "./../collection"

diffPatcher = jsondiffpatch.create
  objectHash: (object) -> object?.cid || object

module.exports =

  initializeContext: ->
    @_context = {}

  context: ->
    {}

  getContext: (context={}, rootContext) ->
    rootContext ||= @_context
    context = if _.isEmpty(context) then rootContext else context
    context.view = this
    context

  presentContext: (context={}) ->
    context.view = this
    for key, value of context = _.defaults(context, @properties.attributes)
      if value instanceof Model or value instanceof Collection
        context[key] = value.toJSON()
    context

  mergeContext: (context={}) ->
    diffPatcher.patch(@_context, diffPatcher.diff(@_context, context))

  updateContextBindings: ->
    @mergeContext(@presentContext(@context()))
    Handlebars.update()
