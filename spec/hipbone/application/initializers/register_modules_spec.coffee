module.exports = ->
  describe "register modules", ->
    it "should register", ->
      class Test extends Hipbone.Model
      app = new Hipbone.Application(models: Test: Test)
      test = new Test
      chai.expect(test.moduleName).to.be.equal("Test")
