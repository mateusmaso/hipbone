module.exports = ->
  describe "register helpers", ->
    it "should get asset path", ->
      app = new Hipbone.Application(assets: foo: "bar")
      chai.expect(Handlebars.compile("{{asset 'foo'}}")()).to.be.equal("bar")

    it "should translate key", ->
      class Application extends Hipbone.Application
        locales:
          en:
            foo:
              other: "{{count}} bars"
      app = new Application
      chai.expect(Handlebars.compile("{{t 'foo' count=3}}")()).to.be.equal("3 bars")

    it "should route url", ->
      app = new Hipbone.Application
      app.router.match("test", route: Hipbone.Route, name: "test", url: "/test")
      chai.expect(Handlebars.compile("{{url 'test'}}")()).to.be.equal("/test")

    it "should format string", ->
      app = new Hipbone.Application
      chai.expect(Handlebars.compile("{{fmt '%@' 123}}")()).to.be.equal("123")

    it "should eval expression", ->
      app = new Hipbone.Application
      chai.expect(Handlebars.compile("{{eval '1 + 1'}}")()).to.be.equal("2")

    it "should render template", ->
      class View extends Hipbone.View
        templatePath: "/path"
        templates:
          "/path/test": Handlebars.compile("test")
      view = new View
      app = new Hipbone.Application
      chai.expect(Handlebars.compile("{{template '/test'}}")(view._context)).to.be.equal("test")

    it "#each should work with collection", ->
      app = new Hipbone.Application
      collection = new Hipbone.Collection([{text: "hello"}, {text: "world"}])
      chai.expect(Handlebars.compile("{{#each collection var='model'}}{{model.text}}{{/each}}")(collection: collection.toJSON())).to.be.equal("helloworld")

    it "#if should work with collection", ->
      app = new Hipbone.Application
      collection = new Hipbone.Collection([])
      chai.expect(Handlebars.compile("{{#if collection}}coco{{/if}}")(collection: collection.toJSON())).to.be.equal("")
