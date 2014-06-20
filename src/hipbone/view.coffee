class Hipbone.View extends Backbone.View

  booleans: []

  defaults: {}

  bindings: {}

  elements: {}

  elementName: "view"

  constructor: (properties={}, content) ->
    @internal = {}
    @properties = {}
    @content = content
    @set(_.defaults({}, properties, @defaults))
    super
    @initialized = true
    @populate()
    @render()

  destroy: ->

  get: (property) ->
    @properties[property]

  set: (property, value, options={}) ->
    if _.isObject(property)
      properties = property
      options = value || {}
    else
      properties = {}
      properties[property] = value

    @_previousProperties = _.pick(@properties, _.keys(properties))
    if not _.isEqual(@_previousProperties, properties)
      @properties = _.extend(@properties, properties)
      @update() if @initialized
      @trigger("change:#{key}") for key, value of properties when value isnt @_previousProperties[key]
      @trigger("change")

  unset: (property) ->
    @set(property, undefined)

  setElement: ->
    super
    attributes = {}
    attributes[_.string.dasherize(property)] = value for property, value of @properties
    @_setAttributes(attributes)

    @$el.data(view: this)
    @$el.lifecycle
      insert: =>
        @trigger('insert')
      remove: =>
        @trigger('remove')
        _.delay(=> not $.contains(document, @el) and @clear())
      change: (attribute, value) =>
        attribute = _.string.camelize(attribute)
        @set(attribute, Handlebars.parseValue(value,  _.contains(@booleans, attribute)))

  _setAttributes: (attributes={}) ->
    for attribute, value of attributes
      if attribute is 'class'
        @$el.addClass(value)
      else if _.contains(@booleans, attribute)
        @$el.attr(attribute, '') if value
      else if not _.isObject(value)
        @$el.attr(attribute, value)

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
    else if @background
      @fetch()

  context: ->

  update: ->
    bindingAttributes = {}

    for attribute, callback of @bindings
      bindingAttributes[attribute] = value = callback.apply(this)
      if attribute is "class"
        @$el.removeClass(@bindingClass)
        @bindingClass = value

    @_setAttributes(bindingAttributes)

    jsondiffpatch.config.objectHash = (object) -> object?.cid || object
    jsondiffpatch.patch(@internal, jsondiffpatch.diff(@internal, @present(@context())))
    Platform.performMicrotaskCheckpoint()

  render: ->
    @update()
    @$el.html(@template(@templateName)) if @templateName

    if @container
      @$(@container).append(@content)
    else
      @$el.append(@content)

  template: (path, context) ->
    path = Hipbone.app.templatePath + path
    context = if _.isEmpty(context) then @internal else @present(context)
    $(Handlebars.parseHTML(Hipbone.app.templates[path](context)))

  context: ->

  present: (context={}) ->
    for key, value of context = _.defaults(context, @properties)
      if value instanceof Hipbone.Model or value instanceof Hipbone.Collection
        context[key] = value.toJSON()
    context

  delegate: (eventName, selector, listener) ->
    selector = @elements[selector] || selector
    listener = _.prefilter(listener, (event) -> not $(event.target).attr('disabled'))
    super(eventName, selector, listener)

  trigger: (name, args...) ->
    @$el.trigger("hb.#{name}", args) if @el
    super

  clear: ->
    @stopListening()
    @destroy()
