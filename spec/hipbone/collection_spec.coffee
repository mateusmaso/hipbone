module.exports = ->
  describe "Collection", ->
    require("./collection/sync_spec").apply(this)
    require("./collection/meta_spec").apply(this)
    require("./collection/store_spec").apply(this)
    require("./collection/parent_spec").apply(this)
    require("./collection/filters_spec").apply(this)
    require("./collection/populate_spec").apply(this)
    require("./collection/pagination_spec").apply(this)
    require("./collection/polymorphic_spec").apply(this)

    describe "json", ->
      before ->
        @collection = new Hipbone.Collection([{id: 1}, {id: 2}], meta: count: 10)

      it "should include by default cid, meta and helpers", ->
        chai.expect(@collection.toJSON()).to.be.deep.equal
          cid: @collection.cid
          length: 2
          meta:
            cid: @collection.meta.cid
            count: 10
          models: [
            {cid: @collection.at(0).cid, id: 1},
            {cid: @collection.at(1).cid, id: 2}
          ]

      it "should behave as backbone when sync", ->
        chai.expect(@collection.toJSON(sync: true)).to.be.deep.equal([{id: 1}, {id: 2}])
