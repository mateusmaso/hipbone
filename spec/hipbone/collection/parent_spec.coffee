module.exports = ->
  describe "parent", ->
    before ->
      class Model extends Hipbone.Model
        urlRoot: "/url"
      class Collection extends Hipbone.Collection
        model: Model
        urlRoot: "/models"
      @model = new Model(id: 1)
      @collection = new Collection(parent: @model)

    it "should initialize", ->
      chai.expect(@collection.parent).to.be.equal(@model)

    it "should compose url", ->
      chai.expect(@collection.url()).to.be.equal("/url/1/models")
