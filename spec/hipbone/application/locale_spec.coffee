module.exports = ->
  describe "locale", ->
    it "should initialize i18n with english locale as default", ->
      class Application extends Hipbone.Application
        locales:
          en:
            hello: "Hello"
      app = new Application
      chai.expect(app.i18n.translate("hello")).to.be.equal("Hello")

    it "should initialize i18n with specified locale", ->
      class Application extends Hipbone.Application
        locales:
          "pt-BR":
            hello: "Olá"
      app = new Application({}, locale: "pt-BR")
      chai.expect(app.i18n.translate("hello")).to.be.equal("Olá")
