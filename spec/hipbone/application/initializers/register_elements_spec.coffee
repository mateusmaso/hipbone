module.exports = ->
  describe "register elements", ->
    it "should register views", ->
      class TestView extends Hipbone.View
      app = new Hipbone.Application(views: TestView: TestView)
      chai.should(Handlebars.elements.test).exist
