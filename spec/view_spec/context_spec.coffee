module.exports = ->
  describe "context", ->
    it "should present context", ->
      model = new Hipbone.Model(text: "test")
      collection = new Hipbone.Collection([model])
      view = new Hipbone.View({model: model, collection: collection, foo: "bar"})
      view.context = ->
        fooUpcase: @get("foo").toUpperCase()
      chai.expect(view.presentContext(view.context())).to.be.deep.equal
        view: view
        collection:
          cid: collection.cid
          length: 1
          meta:
            cid: collection.meta.cid
          models: [
            cid: model.cid
            text: "test"
          ]
        foo: "bar"
        fooUpcase: "BAR"
        loading: false
        model:
          cid: model.cid
          text: "test"

    it "should merge context", ->
      object = one: two: three: 123
      object2 = one: two: three: 321
      view = new Hipbone.View(object: object)
      view.mergeContext(object: object2)
      chai.expect(view._context.object).to.be.equal(object)
