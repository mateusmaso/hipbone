module.exports = ->

  @on "run", ->
    Handlebars.parseHTML(document.body.childNodes)

    if @views.ApplicationView
      @appView = view for key, view of @identityMap.match(/view/) when view instanceof @views.ApplicationView
