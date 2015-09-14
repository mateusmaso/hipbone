module.exports = ->
  describe "validations", ->
    class Page extends Hipbone.Model
      defaults:
        text: ""
      validations:
        text: (text) -> not _.string.isBlank(text)

    before ->
      @page = new Page

    it "should be valid", ->
      @page.set(text: "teste")
      chai.expect([@page.isValid(), @page.errors]).to.be.deep.equal([true, []])

    it "should not be valid", ->
      @page.set(text: "")
      chai.expect([@page.isValid(), @page.errors]).to.be.deep.equal([false, ["text"]])
