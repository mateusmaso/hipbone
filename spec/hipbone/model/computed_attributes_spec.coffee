module.exports = ->
  describe "computed attributes", ->
    class Book extends Hipbone.Model
      defaults:
        title: "Untitled"
        author: "Unknown"
      computedAttributes:
        full_title: "fullTitle"
      fullTitle: -> "#{@get("title")} by #{@get("author")}"

    it "should get attribute", ->
      book = new Book(title: "Hipbone", author: "Mateus")
      chai.expect(book.get("full_title")).to.be.equal("Hipbone by Mateus")
