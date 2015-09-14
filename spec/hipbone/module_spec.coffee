module.exports = ->
  describe "Module", ->
    class Submodule extends Hipbone.Module
      @registerModule "Submodule"
    module = foo: 123

    it "should include and call included", ->
      included = false
      module.included = -> included = true
      Submodule.include(module)
      chai.expect([Submodule::foo, included]).to.be.deep.equal([123, true])

    it "should extend and call extended", ->
      extended = false
      module.extended = -> extended = true
      Submodule.extend(module)
      chai.expect([Submodule.foo, extended]).to.be.deep.equal([123, true])
