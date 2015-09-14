module.exports = ->
  describe "I18n", ->
    i18n = new Hipbone.I18n "en",
      en:
        hello: "Hello {{name}}!"
        baby:
          male: "it's a boy"
          female: "it's a girl"
          neutral: "not sure"
        comment:
          zero: "no comments yet"
          one: "{{count}} comment"
          other: "{{count}} comments"

    describe "interpolate", ->
      it "should interpolate variable", ->
        chai.expect(i18n.translate("hello", name: "World")).to.be.equal("Hello World!")

    describe "pluralize", ->
      it "should be zero", ->
        chai.expect(i18n.translate("comment", count: 0)).to.be.equal("no comments yet")

      it "should be one", ->
        chai.expect(i18n.translate("comment", count: 1)).to.be.equal("1 comment")

      it "should be other", ->
        chai.expect(i18n.translate("comment", count: 2)).to.be.equal("2 comments")

    describe "inflector", ->
      it "should be male", ->
        chai.expect(i18n.translate("baby", gender: "m")).to.be.equal("it's a boy")

      it "should be female", ->
        chai.expect(i18n.translate("baby", gender: "f")).to.be.equal("it's a girl")

      it "should be neutral", ->
        chai.expect(i18n.translate("baby", gender: "")).to.be.equal("not sure")
