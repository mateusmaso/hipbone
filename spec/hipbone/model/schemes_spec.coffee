module.exports = ->
  describe "schemes", ->
    class Model extends Hipbone.Model
      schemes:
        base: (attributes={}) ->
          _.has(attributes, "id") and _.has(attributes, "title") and _.has(attributes, "created_at")
        preview: (attributes={}) ->
          _.has(attributes, "id") and _.has(attributes, "title")
        other: (attributes={}) ->
          _.has(attributes, "id") and _.has(attributes, "other")

    it "should validate schemes", ->
      model = new Model
      schemes = model.validateSchemes({id: 1, title: "test", created_at: Date.now()})
      chai.expect(schemes).to.be.deep.equal(["base", "preview"])
