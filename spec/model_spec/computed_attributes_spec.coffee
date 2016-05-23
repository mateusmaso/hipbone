module.exports = ->
  describe "computed attributes", ->
    it "should get attribute", ->
      class Model extends Hipbone.Model
        computedAttributes:
          description: "description"
        description: ->
          "Title: #{@get("title")}"
      model = new Model(title: "Hipbone")
      chai.expect(model.get("description")).to.be.equal("Title: Hipbone")
