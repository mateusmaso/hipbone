module.exports = ->
  describe "elements", ->
    it "should register element", ->
      class ElementView extends Hipbone.View
        defaults:
          foo: ""
          bar: false
        @register "ElementView"
      chai.expect([ElementView::elementName, ElementView::booleans]).to.be.deep.equal(["element", ["bar"]])

    it "should have hipboneView assigned", ->
      view = new Hipbone.View
      chai.expect(view.el.hipboneView).to.be.equal(view)

    it "should get selector", ->
      class View extends Hipbone.View
        elements:
          foo: ".bar"
      view = new View
      chai.expect([view.getSelector(".foo"), view.getSelector("foo")]).to.be.deep.equal([".foo", ".bar"])

    it "should get $view", ->
      class View extends Hipbone.View
        elements:
          foo: ".bar"
      view = new View
      barView = new Hipbone.View(class: "bar")
      view.$el.append(barView.el)
      chai.expect(view.$view("foo")).to.be.equal(barView)
