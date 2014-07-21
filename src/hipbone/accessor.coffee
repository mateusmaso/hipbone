Hipbone.Accessor =

  initializeAccessor: (options={}) ->
    @defaults ||= {}
    @accessorName ||= options.accessorName || ""
    @accessorsName ||= options.accessorsName || ""
    @accessorEvent ||= options.accessorEvent || "change"
    @accessors = @[@accessorsName] = {}

    @setAccessor(_.defaults({}, options.accessors, @defaults, options.defaults), silent: true)

    if @accessorName
      alias = _.string.capitalize(@accessorName)
    else
      alias = ""

    @["get#{alias}"] ||= @getAccessor
    @["set#{alias}"] ||= @setAccessor
    @["unset#{alias}"] ||= @unsetAccessor
    @["changed#{alias}"] ||= @changedAccessors
    @["previous#{alias}"] ||= @previousAccessor

  getAccessor: (accessor) ->
    _.path(@accessors, accessor)

  setAccessor: (accessor, value, options={}) ->
    if _.isObject(accessor)
      accessors = accessor
      options = value || {}
    else
      accessors = {}
      accessors[accessor] = value

    @_previousAccessors = _.clone(@accessors)
    @_changedAccessors = @changedAccessors(accessors)

    unless _.isEmpty(@_changedAccessors)
      @accessors = _.pathExtend(@accessors, @_changedAccessors)

      unless options.silent
        for accessor, value of @_changedAccessors
          paths = accessor.split(".")
          for path in _.clone(paths).reverse()
            accessor = paths.join(".")
            paths.pop()
            @trigger("#{@accessorEvent}:#{accessor}", this, _.path(@_previousAccessors, accessor), options)

        @trigger(@accessorEvent, this, accessors, options)
      delete @_previousAccessors

  unsetAccessor: (accessor, options={}) ->
    @setAccessor(accessor, undefined, options)

  previousAccessor: (accessor) ->
    @_previousAccessors[accessor] if @_previousAccessors

  changedAccessors: (accessors) ->
    changed = {}
    changed[accessor] = value for accessor, value of accessors when not _.isEqual(@getAccessor(accessor), value)
    changed
