module.exports =

  initializeType: (type, attribute="type") ->
    @type = type || @moduleName
    @typeAttribute ||= attribute
    @defaults = _.extend({}, _.clone(@defaults), type: @type)

  setType: (attributes={}) ->
    @type = attributes[@typeAttribute] || @type
