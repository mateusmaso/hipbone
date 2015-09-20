module.exports = ->
  describe "lifecycle", ->
    it "should insert", (done) ->
      inserted = false
      view = new Hipbone.View
      view.on "insert", -> inserted = true
      view.$el.appendTo("#fixtures")

      _.defer ->
        chai.expect(inserted).to.be.true
        done()

    it "should detach", (done) ->
      detached = false
      view = new Hipbone.View
      view.on "detach", -> detached = true
      view.$el.appendTo("#fixtures")
      view.$el.remove()

      _.defer ->
        chai.expect(detached).to.be.true
        done()

    it "should change", (done) ->
      changed = false
      view = new Hipbone.View
      view.on "change", -> changed = true
      view.$el.appendTo("#fixtures")
      view.$el.attr("foo", "bar")

      _.defer ->
        chai.expect(changed).to.be.true
        done()

    it "should change props", (done) ->
      class View extends Hipbone.View
        defaults:
          fooBar: false
        @register "View"
      view = new View
      view.$el.appendTo("#fixtures")
      view.$el.attr("foo-bar", "")

      _.defer ->
        chai.expect(view.get("fooBar")).to.be.true
        done()

    it "should not change internal props", (done) ->
      class View extends Hipbone.View
        internals: ["foo"]
        defaults:
          fooBar: false
        @register "View"
      view = new View
      view.$el.appendTo("#fixtures")
      view.$el.on "change", -> console.log arguments
      view.$el.attr("foo-bar", "")

      _.defer ->
        chai.expect(view.get("fooBar")).to.be.true
        done()
