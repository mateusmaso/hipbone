module.exports =

  initializeContext: ->
    @_context = {}

  context: ->
    {}

  getContext: (context={}) ->
    if _.isEmpty(context)
      @_context
    else
      @presentContext(context)

  presentContext: (context={}) ->
    for key, value of context = _.defaults(context, @properties.attributes)
      if value instanceof Hipbone.Model or value instanceof Hipbone.Collection
        context[key] = value.toJSON()
    context

  mergeContext: (context={}) ->
    jsondiffpatch.patch(@_context, jsondiffpatch.diff(@_context, context))

  updateContextBindings: ->
    @mergeContext(@presentContext(@context()))
    Platform.performMicrotaskCheckpoint()
