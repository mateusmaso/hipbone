module.exports = ->
  describe "filters", ->
    it "should be in query url params", ->
      class Collection extends Hipbone.Collection
        urlRoot: "/models"
        filters:
          filter: true
      collection = new Collection
      chai.expect(collection.url()).to.be.equal("/models?filter=true")
