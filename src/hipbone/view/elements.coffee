findBooleans = (attributes={}, internals=[]) ->
  booleans = []
  booleans.push(key) for key, value of attributes when _.isBoolean(value) and not _.contains(internals, key)
  booleans

module.exports =

  registered: ->
    @::elementName = s.dasherize(@::moduleName).substring(1).replace("-view", "")
    @::booleans = findBooleans(@::defaults, @::internals)
    View = this

    Handlebars.registerElement @::elementName, (attributes) ->
      new View(attributes, content: $(this).contents()).el
    , booleans: @::booleans

  initializeElements: ->
    @elementName ||= ""
    @elements ||= {}
    @booleans ||= []

  getSelector: (selector) ->
    @elements[selector] || selector

  defineElement: ->
    @el.hipboneView = this
    @el

  $view: (selector) ->
    @$(selector)[0].hipboneView if @$(selector)[0]
