module.exports =

  update: (options={}) ->
    if options.immediate
      @updateContext()
      @updateContextBindings()
      @updateClassNameBindings()
    else
      _.defer =>
        @updateContext()
        @updateContextBindings()
        @updateClassNameBindings()
