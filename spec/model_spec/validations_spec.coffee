module.exports = ->
  describe "validations", ->
    before ->
      class Model extends Hipbone.Model
        defaults:
          text: ""
        validations:
          text: (text) -> text.trim() isnt ""
      @model = new Model

    it "should be valid", ->
      @model.set(text: "teste")
      chai.expect([@model.isValid(), @model.errors]).to.be.deep.equal([true, []])

    it "should not be valid", ->
      @model.set(text: "")
      chai.expect([@model.isValid(), @model.errors]).to.be.deep.equal([false, ["text"]])
