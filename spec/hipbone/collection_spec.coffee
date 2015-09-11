module.exports = ->
  describe "Collection", ->
    require("./collection/sync_spec").apply(this)
    require("./collection/meta_spec").apply(this)
    require("./collection/store_spec").apply(this)
    require("./collection/parent_spec").apply(this)
    require("./collection/filters_spec").apply(this)
    require("./collection/populate_spec").apply(this)
    require("./collection/pagination_spec").apply(this)
    require("./collection/dynamic_model_spec").apply(this)

    describe "json", ->
      # before ->
      #   @pages = new App.Pages([{id: 1}, {id: 2}], meta: count: 10)
      #
      # it "should include by default cid, meta and helpers", ->
      #   chai.expect(_.keys(@pages.toJSON())).to.be.deep.equal(["count", "length", "cid", "models"])
      #
      # it "should behave as backbone when sync", ->
      #   chai.expect(@pages.toJSON(sync: true)).to.be.deep.equal([{id: 1, type: "Page"}, {id: 2, type: "Page"}])
