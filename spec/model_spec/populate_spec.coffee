module.exports = ->
  describe "populate", ->
    it "should populate", ->
      deferred = $.Deferred()
      class Model extends Hipbone.Model
        populate: -> deferred.resolve()
      model = new Model
      model.prepare()
      chai.expect(deferred).to.be.fulfilled

    it "should not populate", ->
      deferred = $.Deferred()
      class Model extends Hipbone.Model
        populate: -> deferred.resolve()
      model = new Model
      model.didSync()
      model.prepare()
      chai.expect(deferred).to.not.be.fulfilled
