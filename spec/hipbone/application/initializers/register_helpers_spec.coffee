module.exports = ->
  describe "register helpers", ->
    it "should get asset path", ->
      app = new Hipbone.Application(state: assets: foo: "bar")
      chai.expect(Handlebars.compile("{{asset 'foo'}}")()).to.be.equal("bar")

    it "should translate key", ->
      app = new Hipbone.Application(locales: en: foo: other: "{{count}} bars")
      chai.expect(Handlebars.compile("{{t 'foo' count=3}}")()).to.be.equal("3 bars")

    it "should route url", ->
      class TestRoute extends Hipbone.Route
        url: "test"
        toURL: ->
          "/test"
      app = new Hipbone.Application(routes: TestRoute: TestRoute)
      app.run()
      app.router.match("test")
      chai.expect(Handlebars.compile("{{url 'test'}}")()).to.be.equal("/test")

    it "should format string", ->
      chai.expect(Handlebars.compile("{{fmt '%@' 123}}")()).to.be.equal("123")

    it "should eval expression", ->
      chai.expect(Handlebars.compile("{{eval '1 + 1'}}")()).to.be.equal("2")

    it "#each should work with collection", ->
      collection = new Hipbone.Collection([{text: "hello"}, {text: "world"}])
      chai.expect(Handlebars.compile("{{#each collection var='model'}}{{model.text}}{{/each}}")(collection: collection.toJSON())).to.be.equal("helloworld")

    it "#if should work with collection", ->
      collection = new Hipbone.Collection([])
      chai.expect(Handlebars.compile("{{#if collection}}coco{{/if}}")(collection: collection.toJSON())).to.be.equal("")
