module.exports =

  included: ->
    @elementName = ->
      _.string.dasherize(@::moduleName).substring(1).replace("-view", "")

  initializeElements: (elementName, elements={}) ->
    @elements ||= {}
    @elementName = elementName if elementName

  getSelector: (selector) ->
    @elements[selector] || selector
