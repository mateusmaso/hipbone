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
      class Page extends Hipbone.Model
      class Pages extends Hipbone.Collection
        model: Page

      before ->
        @pages = new Pages([{id: 1}, {id: 2}], meta: count: 10)

      it "should include by default cid, meta and helpers", ->
        chai.expect(@pages.toJSON()).to.be.deep.equal
          cid: @pages.cid
          length: 2
          meta:
            cid: @pages.meta.cid
            count: 10
          models: [
            {cid: @pages.at(0).cid, id: 1},
            {cid: @pages.at(1).cid, id: 2}
          ]

      it "should behave as backbone when sync", ->
        chai.expect(@pages.toJSON(sync: true)).to.be.deep.equal([{id: 1}, {id: 2}])
