module.exports = ->
  describe "element", ->
    it "should append to element", ->
      elementRoot = $("<element-root>")[0]
      element = $("<element>")[0]
      class Route extends Hipbone.Route
        elementRoot: elementRoot
        element: -> element
      route = new Route
      route.renderElement()
      chai.expect($(elementRoot).children().first()[0]).to.be.equal(element)

    it "should set content to view", ->
      view = new Hipbone.View
      element = $("<element>")[0]
      class Route extends Hipbone.Route
        elementRoot: view.el
        element: -> element
      route = new Route
      route.renderElement()
      chai.expect(view.$el.children().first()[0]).to.be.equal(element)
