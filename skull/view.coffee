class Skull.View extends Backbone.View
    
  @include Skull.Station
  @include Skull.Bubble
  @include Skull.Ajax

  constructor: (options={}) ->
    @on("remove", @clear)
    @on("sync", @update)
    @options = options
    @elements ||= {}
    @internal = {}
    super
    @initializeBubble()
    @initializeStation()
    @$el.data(view: @)
    @$el.addClass(@options.class)
    @$el.lifecycle(insert: => @trigger('insert'))
    @$el.lifecycle(remove: => @trigger('remove'))
    @populate()
    @render()

  destroy: ->

  $: (selector) ->
    super(@elements[selector] || selector)

  $view: (selector) ->
    @$(selector).data('view')

  fetch: ->

  synced: ->

  populate: ->
    if not @fetched and not @synced() and xhr = @fetch()
      @fetched = @loading = true
      xhr.done(=> @loading = false).done(=> @trigger("sync"))

  context: ->

  update: ->
    jsondiffpatch.config.objectHash = (object) -> object.cid or object
    jsondiffpatch.patch(@internal, jsondiffpatch.diff(@internal, @present(@context())))
    @trigger("update")
    @

  render: ->
    @update()
    @$el.empty()
    @$el.html(@template(@templateName)) if @templateName
    @trigger("render")
    @
  
  template: (path, context) ->
    path = Skull.app.prefix + path
    context = if _.isEmpty(context) then @internal else @present(context)
    Handlebars.parseHTML(Skull.app.templates[path](context))

  context: ->

  present: (context={}) ->
    context.loading = @loading
    context
  
  delegateEvents: (events) ->
    _events = {}
    for event, callback of events || @events || {}
      do (event, callback) =>
        _event = event
        for selector in event.match(/(\w+)/g) || [] when @elements[selector]
          _event = _event.replace(new RegExp("\\b#{selector}\\b", "g"), @elements[selector])
        _events[_event] = (event) ->
          @[callback].apply(@, arguments) unless $(event.target).attr('disabled')
    super(_events)

  enable: (selector) ->
    @$(selector).removeClass("disable")
    @$(selector).removeAttr('disabled')

  disable: (selector) ->
    @$(selector).addClass("disable")
    @$(selector).attr('disabled', true)

  clear: ->
    @stopListening()
    @undelegateBubbles()
    @undelegateStations()
    @destroy()
