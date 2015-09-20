module.exports = ->
  describe "ajax", ->
    it "should prepend url with host", ->
      class Application extends Hipbone.Application
        host: "/api/v1"
      app = new Application
      chai.expect(app.ajaxUrl("/ping")).to.be.equal("/api/v1/ping")

    it "should add headers", ->
      class Application extends Hipbone.Application
        headers:
          "X-CSRF-Token": "abc"
          "X-Auth-Token": -> @get("authToken")
      app = new Application(authToken: 123)
      chai.expect(app.ajaxHeaders()).to.be.deep.equal("X-Auth-Token": 123, "X-CSRF-Token": "abc")
