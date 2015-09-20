module.exports = ->
  describe "Module", ->
    Moo =
      moo: -> "mooh"

    class Animal extends Hipbone.Module
      @register "Animal"

    class Cow extends Animal
      @register "Cow"

    it "set module name", ->
      chai.expect([Animal::moduleName, Cow::moduleName]).to.be.deep.equal(["Animal", "Cow"])

    it "register subclass", ->
      chai.expect([_.contains(Animal.subclasses, Cow), _.keys(Cow.subclasses).length]).to.be.deep.equal([true, 0])

    it "should include and call included", ->
      included = false
      Moo.included = -> included = true
      Cow.include(Moo)
      chai.expect([Cow::moo(), included, _.contains(Cow.includedModules, Moo)]).to.be.deep.equal(["mooh", true, true])

    it "should extend and call extended", ->
      extended = false
      Moo.extended = -> extended = true
      Cow.extend(Moo)
      chai.expect([Cow.moo(), extended, _.contains(Cow.extendedModules, Moo)]).to.be.deep.equal(["mooh", true, true])
