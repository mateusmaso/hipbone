module.exports = ->
  describe "attributes", ->
    it "should be dasherized", ->
      view = new Hipbone.View(fooBar: "bar")
      chai.expect(view.$el.attr("foo-bar")).to.be.equal("bar")

    it "should add if class attribute", ->
      class View extends Hipbone.View
        className: "test"
      view = new View(class: "test-class")
      chai.expect(view.$el.attr("class")).to.be.equal("test test-class")

    it "should not set boolean attribute if false", ->
      class View extends Hipbone.View
        defaults:
          test: false
        @register "View"
      view = new View
      chai.expect(view.$el.attr("test")).to.be.equal(undefined)

    it "should set boolean attribute empty if true", ->
      class View extends Hipbone.View
        defaults:
          test: false
        @register "View"
      view = new View(test: true)
      chai.expect(view.$el.attr("test")).to.be.equal("")

    it "should not set object attribute", ->
      view = new Hipbone.View(object: {})
      chai.expect(view.$el.attr("object")).to.be.equal(undefined)
