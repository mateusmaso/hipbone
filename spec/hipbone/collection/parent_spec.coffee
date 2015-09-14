module.exports = ->
  describe "parent", ->
    class Page extends Hipbone.Model
      urlRoot: "/pages"
    class Annotation extends Hipbone.Model
    class Annotations extends Hipbone.Collection
      model: Annotation
      urlRoot: "/annotations"

    before ->
      @page = new Page(id: 1)
      @annotations = new Annotations([], parent: @page)

    it "should initialize", ->
      chai.expect(@annotations.parent).to.be.equal(@page)

    it "should compose url", ->
      chai.expect(@annotations.url()).to.be.equal("/pages/1/annotations")
