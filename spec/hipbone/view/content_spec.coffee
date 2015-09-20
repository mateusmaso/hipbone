module.exports = ->
  describe "content", ->
    it "should append content to element", ->
      element = $("<element>")[0]
      view = new Hipbone.View
      view.setContent(element)
      chai.expect(view.$el.children().last()[0]).to.be.equal(element)

    it "should append content to container", ->
      element = $("<element>")[0]
      class View extends Hipbone.View
        container: "#container"
        templateName: "view"
        templates:
          view: Handlebars.compile("<div id='container'></div>")
      view = new View
      view.setContent(element)
      chai.expect(view.$("#container").children().first()[0]).to.be.equal(element)
