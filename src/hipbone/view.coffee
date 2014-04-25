class Hipbone.View extends Backbone.View
    
  @include Hipbone.Ajax

  constructor: (options={}, content) ->
    @options = {}
    @internal = {}
    @defaults ||= {}
    @elements ||= {}
    @content = content
    @set(_.defaults({}, options, @defaults))
    super
    @populate()
    @render()

  destroy: ->

  get: (option) ->
    @options[option]

  set: (options={}) ->
    @previousOptions = _.pick(@options, _.keys(options))
    if not _.isEqual(@previousOptions, options)
      @options = _.extend(@options, options)
      @update() if @rendered
      @trigger("change:#{key}") for key, value of options when value isnt @previousOptions[key]
      @trigger("change")

  unset: (option) ->
    options = {}
    options[option] = undefined
    @set(options)

  setAttribute: (attributes) ->
    for attribute, value of attributes
      attribute = _.string.dasherize(attribute)
      if attribute is 'class'
        @$el.addClass(value)
      else if _.isBoolean(value) and value
        @$el.attr(attribute, '')
      else if not _.isObject(value)
        @$el.attr(attribute, value)

  setElement: ->
    super
    @$el.data(view: @)
    @$el.append(@content)
    @$el.lifecycle(insert: => @trigger('insert'))
    @$el.lifecycle(remove: => @trigger('remove'))
    @$el.lifecycle(remove: => _.delay(=> not $.contains(document, @el) and @clear()))
    @setAttribute(@options)
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
    else if @eagerSync and fetching = @fetch()
      @set(reloading: true)
      fetching.done => @set(reloading: false)

  context: ->

  update: ->
    jsondiffpatch.config.objectHash = (object) -> object?.cid || object
    jsondiffpatch.patch(@internal, jsondiffpatch.diff(@internal, @present(@context())))
    Platform.performMicrotaskCheckpoint()
    @trigger("update")
    @

  render: ->
    @update()
    @$el.html(@template(@templateName)) if @templateName
    @rendered = true
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
        [event, eventName, selector] = event.match(/^(\S+)\s*(.*)$/)
        if alias = @elements[selector]
          event = "#{eventName} #{selector.replace(new RegExp("\\b#{selector}\\b", "g"), alias)}"
        events[event] = _.prefilter @[callback], (event) ->
          not $(event.target).attr('disabled')
    super(events)

  enable: (selector) ->
    @$(selector).removeAttr('disabled')

  disable: (selector) ->
    @$(selector).attr('disabled', true)

  trigger: (name, args...) ->
    @$el?.trigger("#{name}.view", args)
    super

  clear: ->
    @stopListening()
    @destroy()
