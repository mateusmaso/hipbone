module.exports =

  initializeParent: (parent) ->
    @parent = parent

  setParent: (parent, options={}) ->
    if @parent isnt parent
      @parent = parent
      @trigger("change:parent", @parent) unless options.silent

  parentUrl: (options={}) ->
    if @parent then "#{@parent.url(options)}#{@urlRoot}" else @urlRoot
