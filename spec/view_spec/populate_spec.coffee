module.exports = ->
  describe "populate", ->
    it "should populate", ->
      deferred = $.Deferred()
      class View extends Hipbone.View
        populate: -> deferred.resolve()
      view = new View
      view.prepare()
      chai.expect(deferred).to.be.fulfilled

    it "should not populate", ->
      deferred = $.Deferred()
      class View extends Hipbone.View
        populate: -> deferred.resolve()
      view = new View
      deferred.resolve()
      view.prepare()
      chai.expect(deferred).to.be.fulfilled

    it "should show loading when populating", ->
      deferred = $.Deferred()
      class View extends Hipbone.View
        populated: -> deferred.state() is "resolved"
        populate: -> deferred
      view = new View
      view.prepare()
      beforePopulate = view.get("loading")
      deferred.resolve()
      afterPopulate = view.get("loading")
      chai.expect([beforePopulate, afterPopulate]).to.be.deep.equal([true, false])

    it "should not show loading when background populating", ->
      deferred = $.Deferred()
      class View extends Hipbone.View
        background: true
        populated: -> true
        populate: -> deferred
      view = new View
      view.prepare()
      beforePopulate = view.get("loading")
      deferred.resolve()
      afterPopulate = view.get("loading")
      chai.expect([beforePopulate, afterPopulate]).to.be.deep.equal([false, false])
