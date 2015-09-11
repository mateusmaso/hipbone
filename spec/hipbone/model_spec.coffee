module.exports = ->
  describe "Model", ->
    require("./model/type_spec").apply(this)
    require("./model/sync_spec").apply(this)
    require("./model/store_spec").apply(this)
    require("./model/mappings_spec").apply(this)
    require("./model/populate_spec").apply(this)
    require("./model/validations_spec").apply(this)
    require("./model/nested_attributes_spec").apply(this)
    require("./model/computed_attributes_spec").apply(this)

    describe "json", ->
      # before ->
      #   @book = new App.Book(id: 5, title: "Hipbone", author: "Mateus", pages: [{book_id: 5}, {book_id: 5}])
      #
      # it "should include by default cid and computed attributes", ->
      #   chai.expect(_.keys(@book.toJSON())).to.be.deep.equal(["id", "title", "author", "type", "cid", "full_title"])
      #
      # it "should behave as backbone when sync", ->
      #   chai.expect(_.keys(@book.toJSON(sync: true))).to.be.deep.equal(["id", "title", "author", "type"])
      #
      # it "should include mappings when requested", ->
      #   chai.expect(_.path(@book.toJSON(mappings: {pages: {mappings: book: {}}}), "pages.models.1.book.id")).to.be.equal(5)
