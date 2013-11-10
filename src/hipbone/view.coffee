class Hipbone.View extends Backbone.View
    
  @include Hipbone.Station
  @include Hipbone.Bubble
  @include Hipbone.Ajax

  constructor: (options={}) ->
    @options = {}
    @internal = {}
    @defaults ||= {}
    @elements ||= {}
    @set(_.defaults(options, @defaults))
    @initializeStation()
    super
    @initializeBubble()
    @$el.data(view: @)
    @$el.addClass(@get('class'))
    @$el.lifecycle(insert: => @trigger('insert'))
    @$el.lifecycle(remove: => @trigger('remove'))
    @on("remove", _.debounce(_.prefilter(@clear, => not $.contains(document, @el))))
    @on("change", @update)
    @on("sync", @update)
    @populate()
    @render()

  destroy: ->

  get: (option) ->
    @options[option]

  set: (options={}) ->
    current = _.pick(@options, _.keys(options))
    if not _.isEqual(current, options)
      @options = _.extend(@options, options)
      @trigger("change", current)

  $: (selector) ->
    super(@elements[selector] || selector)

  $view: (selector) ->
    @$(selector).data('view')

  fetch: ->

  synced: ->

  populate: ->
    if not @synced() and fetching = @fetch()
      @set(loading: true)
      fetching.done => @set(loading: false)
      fetching.done => @trigger("sync")

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
    path = Hipbone.app.prefix + path
    context = if _.isEmpty(context) then @internal else @present(context)
    Handlebars.parseHTML(Hipbone.app.templates[path](context))

  context: ->

  present: (context={}) ->
    for key, value of @options when not context[key]?
      if value instanceof Hipbone.Model or value instanceof Hipbone.Collection
        context[key] = value.toJSON()
      else
        context[key] = value
    context

  delegateEvents: (events) ->
    events ||= _.clone(@events) || {}
    for event, callback of events
      do (event, callback) =>
        delete events[event]
        for selector in event.match(/(\w+)/g) || [] when @elements[selector]
          event = event.replace(new RegExp("\\b#{selector}\\b", "g"), @elements[selector])
        events[event] = _.prefilter @[callback], (event) ->
          not $(event.target).attr('disabled')
    super(events)

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
