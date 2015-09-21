Model = require "./../model"
Collection = require "./../collection"

module.exports =

  initializeContext: ->
    @_context = {}

  context: ->
    {}

  getContext: (context={}, rootContext) ->
    rootContext ||= @_context
    context = if _.isEmpty(context) then rootContext else context
    context.cid = @cid
    context

  presentContext: (context={}) ->
    context.cid = @cid
    for key, value of context = _.defaults(context, @properties.attributes)
      if value instanceof Model or value instanceof Collection
        context[key] = value.toJSON()
    context

  mergeContext: (context={}) ->
    jsondiffpatch.patch(@_context, jsondiffpatch.diff(@_context, context))

  updateContextBindings: ->
    @mergeContext(@presentContext(@context()))
    Platform.performMicrotaskCheckpoint()
