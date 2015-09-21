module.exports = ->
  describe "Model", ->
    require("./model/sync_spec").apply(this)
    require("./model/store_spec").apply(this)
    require("./model/mappings_spec").apply(this)
    require("./model/populate_spec").apply(this)
    require("./model/validations_spec").apply(this)
    require("./model/nested_attributes_spec").apply(this)
    require("./model/computed_attributes_spec").apply(this)

    describe "json", ->
      class Book extends Hipbone.Model
        mappings:
          pages: -> Pages
        computedAttributes:
          full_title: "fullTitle"
        fullTitle: ->
          "#{@get("title")} by #{@get("author")}"
        @register "Book"

      class Page extends Hipbone.Model
        mappings:
          book: -> Book
        @register "Page"

      class Pages extends Hipbone.Collection
        model: Page
        @register "Pages"

      before ->
        Hipbone.Model.identityMap.clear()
        Hipbone.Collection.identityMap.clear()
        @book = new Book(id: 1, title: "Hipbone", author: "Mateus", pages: [{book_id: 1}, {book_id: 1}])

      it "should include by default cid and computed attributes", ->
        chai.expect(@book.toJSON()).to.be.deep.equal
          cid: @book.cid
          id: 1
          title: "Hipbone"
          author: "Mateus"
          full_title: "Hipbone by Mateus"

      it "should behave as backbone when sync", ->
        chai.expect(@book.toJSON(sync: true)).to.be.deep.equal
          id: 1
          title: "Hipbone"
          author: "Mateus"

      it "should include mappings when requested", ->
        chai.expect(@book.toJSON(mappings: {pages: {mappings: book: {}}})).to.be.deep.equal
          cid: @book.cid
          id: 1
          title: "Hipbone"
          author: "Mateus"
          full_title: "Hipbone by Mateus"
          pages:
            cid: @book.get("pages").cid
            length: 2
            meta:
              cid: @book.get("pages").meta.cid
            models: [{
              book:
                cid: @book.cid
                id: 1
                title: "Hipbone"
                author: "Mateus"
                full_title: "Hipbone by Mateus"
              book_id: 1
              cid: @book.get("pages").at(0).cid
            }, {
              book:
                cid: @book.cid
                id: 1
                title: "Hipbone"
                author: "Mateus"
                full_title: "Hipbone by Mateus"
              book_id: 1
              cid: @book.get("pages").at(1).cid
            }]
