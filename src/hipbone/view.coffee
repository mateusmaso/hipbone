class Hipbone.View extends Backbone.View

  @include Hipbone.Accessor

  hashName: "view"

  elementName: "view"

  constructor: (properties={}, content) ->
    hashes = @hashes(properties)

    if view = Hipbone.app.identityMap.findAll(hashes)[0]
      view.setContent(content)
      view.set(properties)
      return view
    else
      @store(hashes)

    @booleans ||= []
    @elements ||= {}
    @internal = {}
    @content = content
    @classNameBindings ||= {}
    @deferact = _.debounce(@react)
    @initializeAccessor(accessorsName: "properties", accessors: properties)
    super
    @populate()
    @render()
    @hooks()

  destroy: ->

  insert: ->

  detach: ->

  change: (attribute, value) ->

  hooks: ->
    @$el.lifecycle
      insert: =>
        @insert()
        @trigger("insert")
      remove: =>
        @detach()
        @trigger("detach")
      change: (attribute, value) =>
        @change(attribute, value)
        attribute = _.string.camelize(attribute)
        @set(attribute, Handlebars.parseValue(value,  _.contains(@booleans, attribute)))

  setAccessor: (accessor, value, options={}) ->
    options = value || {} if _.isObject(accessor)
    Hipbone.Accessor.setAccessor.apply(this, arguments)
    @update(options) if @$el?.is("[lifecycle]")
    @store()

  setElement: ->
    super
    @set(class: "#{@el.className} #{@get("class") || ''}")
    @_setAttributes(@properties)
    @el.hipboneView = this

  setContent: (content) ->
    if @container
      @$(@container).append(content)
    else
      @$el.append(content)

    @content = content

  setAttribute: (attribute, value) ->
    attribute = _.string.dasherize(attribute)

    if attribute is "class"
      @$el.addClass(value)
    else if _.contains(@booleans, attribute)
      @$el.attr(attribute, '') if value
    else if not _.isObject(value)
      @$el.attr(attribute, value)

  _setAttributes: (attributes={}) ->
    @setAttribute(attribute, value) for attribute, value of attributes

  $: (selector) ->
    super(@elements[selector] || selector)

  $view: (selector) ->
    @$(selector)[0].hipboneView

  fetch: ->

  synced: ->

  populate: ->
    @set(loading: true) unless @synced()
    @prepare().done => @set(loading: false)

  prepare: ->
    if @background
      @fetch()
    else
      $.when(@synced() || @fetch())

  context: ->

  update: (options={}) ->
    @merge(@present(@context()))

    if options.immediate or Object.observe
      @react()
    else
      @deferact()

  render: ->
    @merge(@present(@context()))
    @$el.html(@template(@templateName)) if @templateName
    @setContent(@content) if @content

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
    super(eventName, selector, listener)

  bubble: ->
    @trigger(arguments...)
    @$el.trigger(arguments...)

  remove: ->
    @destroy()
    super

  hashes: (properties={}) ->
    hashes = []
    hashes.push(@cid) if @cid
    hashes

  react: ->
    @_classNameBindings ||= {}
    for className, callback of @classNameBindings
      oldValue = @_classNameBindings[className]
      value = @_classNameBindings[className] = callback.apply(this)
      if _.isBoolean(value)
        if value
          @$el.addClass(className)
        else
          @$el.removeClass(className)
      else if value isnt oldValue
        @$el.removeClass(oldValue)
        @$el.addClass(value)

    Platform.performMicrotaskCheckpoint()

  merge: (context) ->
    jsondiffpatch.config.objectHash = (object) -> object?.cid || object
    jsondiffpatch.patch(@internal, jsondiffpatch.diff(@internal, context))

  store: (hashes) ->
    hashes ||= @hashes()
    Hipbone.app.identityMap.storeAll(hashes, this)
