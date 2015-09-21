module.exports = ->
  describe "parse model", ->
    it "should parse model", ->
      app = new Hipbone.Application
      model = new Hipbone.Model
      chai.expect(Handlebars.parseValue(Handlebars.compile("{{model}}")(model: model.toJSON()))).to.be.equal(model)

    it "should parse collection", ->
      app = new Hipbone.Application
      collection = new Hipbone.Collection
      chai.expect(Handlebars.parseValue(Handlebars.compile("{{collection}}")(collection: collection.toJSON()))).to.be.equal(collection)
