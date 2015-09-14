module.exports = ->
  describe "ajax", ->
    it "should prepend url with host", ->
      app = new Hipbone.Application(host: "/api/v1")
      chai.expect(app.ajaxUrl("/ping")).to.be.equal("/api/v1/ping")

    it "should add headers", ->
      app = new Hipbone.Application(headers: {"X-CSRF-Token": "abcdefg", "X-Auth-Token": -> @authToken})
      app.authToken = 123
      chai.expect(app.ajaxHeaders()).to.be.deep.equal("X-Auth-Token": 123, "X-CSRF-Token": "abcdefg")
