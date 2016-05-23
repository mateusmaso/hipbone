module.exports = ->
  describe "class name bindings", ->
    it "should update bindings", (done) ->
      class View extends Hipbone.View
        classNameBindings:
          "foo": -> @get("foo") isnt "bar"
          "foo-bar": -> @get("foo") is "bar"
      view = new View(foo: "")

      beforeUpdate = view.$el.attr("class")
      view.set(foo: "bar")

      _.defer ->
        afterUpdate = view.$el.attr("class")
        chai.expect([beforeUpdate, afterUpdate]).to.be.deep.equal(["foo", "foo-bar"])
        done()
