Handlebars = require "handlebars"

module.exports = ->

  @on "run", ->
    Handlebars.parseHTML(document.body.childNodes)
