class Hipbone.Route extends Hipbone.Module

  @include Hipbone.Accessor
  @include Backbone.Events

  hashName: "route"

  constructor: (params={}) ->
    params = @parse(params)
    hashes = @hashes(params)
    path = Hipbone.history.location.pathname

    if Hipbone.app.identityMap.find(path) and not Hipbone.history.popstate
      hashes = _.without(hashes, path)

    if route = Hipbone.app.identityMap.findAll(hashes)[0]
      route.set(params)
      route.display()
      return route
    else
      @store(hashes)

    @cid = _.uniqueId('route')
    @initializeAccessor(accessorsName: "params", accessors: params)
    @initialize(params)
    @populate()

  initialize: ->

  setAccessor: ->
    Hipbone.Accessor.setAccessor.apply(this, arguments)
    @store()

  fetch: ->

  context: ->

  transition: ->

  populate: ->
    @prepare().done => @display()

  display: ->
    @transition()
    @render()
    document.title = @title()

  prepare: ->
    $.when(@fetch())

  parse: (params={}) ->
    params

  hashes: (params={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes.push(Hipbone.history.location.pathname)
    hashes

  buildUrl: (params={}) ->

  title: ->
    Hipbone.app.title

  content: ->
    Hipbone.app.appView.template(@contentName, @context())

  render: ->
    @element ||= @content()
    Hipbone.app.appView.templateName = @templateName
    Hipbone.app.appView.setContent(@element)
    Hipbone.app.appView.set(@context())
    Hipbone.app.appView.$el.children().detach()
    Hipbone.app.appView.render()

  store: (hashes) ->
    hashes ||= @hashes(@params)
    Hipbone.app.identityMap.storeAll(hashes, this)
