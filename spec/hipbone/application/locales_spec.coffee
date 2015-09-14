module.exports = ->
  describe "locales", ->
    it "should initialize i18n with english locale as default", ->
      app = new Hipbone.Application(locales: en: hello: "Hello")
      chai.expect(app.i18n.translate("hello")).to.be.equal("Hello")

    it "should initialize i18n with specified locale", ->
      app = new Hipbone.Application(locale: "pt-BR", locales: "pt-BR": hello: "Olá")
      chai.expect(app.i18n.translate("hello")).to.be.equal("Olá")
