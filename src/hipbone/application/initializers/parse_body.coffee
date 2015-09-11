module.exports = ->

  @on "run", ->
    Handlebars.parseHTML(document.body.childNodes)
    @appView = view for key, view of @identityMap.match(/view/) when view instanceof @views.ApplicationView
