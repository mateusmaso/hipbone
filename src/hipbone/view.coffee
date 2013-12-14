class Hipbone.View extends Backbone.View
    
  @include Hipbone.Station
  @include Hipbone.Bubble
  @include Hipbone.Ajax

  constructor: (options={}, content) ->
    @options = {}
    @internal = {}
    @defaults ||= {}
    @elements ||= {}
    @content = content
    @set(_.defaults(options, @defaults))
    @initializeStation()
    super
    @initializeBubble()
    @on("remove", _.debounce(_.prefilter(@clear, => not $.contains(document, @el))))
    @on("change", @update)
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

  setAttribute: (attributes) ->
    for attribute, value of attributes
      attribute = _.string.dasherize(attribute)
      if attribute is 'class'
        @$el.addClass(value)
      else if _.isBoolean(value)
        @$el.attr(attribute, value)
      else if not _.isObject(value)
        @$el.attr(attribute, value)

  setElement: ->
    super
    @$el.data(view: @)
    @$el.append(@content)
    @setAttribute(@options)
    @$el.lifecycle(insert: => @trigger('insert'))
    @$el.lifecycle(remove: => @trigger('remove'))
    @

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

  context: ->

  update: ->
    jsondiffpatch.config.objectHash = (object) -> object?.cid or object
    jsondiffpatch.patch(@internal, jsondiffpatch.diff(@internal, @present(@context())))
    @trigger("update")
    @

  render: ->
    @update()
    @$el.html(@template(@templateName)) if @templateName
    @trigger("render")
    @
  
  template: (path, context) ->
    path = Hipbone.app.prefix + path
    context = if _.isEmpty(context) then @internal else @present(context)
    $(Handlebars.parseHTML(Hipbone.app.templates[path](context)))

  context: ->

  present: (context={}) ->
    for key, value of context = _.defaults(context, @options)
      if value instanceof Hipbone.Model or value instanceof Hipbone.Collection
        context[key] = value.toJSON()
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
