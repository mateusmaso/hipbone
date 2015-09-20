module.exports = ->
  describe "bubble", ->
    it "should trigger and bubble DOM tree", ->
      bubble = trigger = false
      view = new Hipbone.View
      element = $("<element>")
      element.append(view.el)
      element.on "didBubble", -> bubble = true
      view.on "didBubble", -> trigger = true
      view.bubble("didBubble")
      chai.expect([bubble, trigger]).to.be.deep.equal([true, true])
