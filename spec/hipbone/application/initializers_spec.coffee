module.exports = ->
  describe "initializers", ->
    it "should extend and run initializers with options as default", ->
      initializers = []
      initializers.push ->
        @get("output").push("foo")
      initializers.push (options) ->
        @get("output").push("bar") if options.bar
      class Application extends Hipbone.Application
        initializers: initializers
      app = new Application(output: [], {bar: true})
      chai.expect(app.get("output")).to.be.deep.equal(["foo", "bar"])

    require("./initializers/parse_body_spec").apply(this)
    require("./initializers/parse_model_spec").apply(this)
    require("./initializers/start_history_spec").apply(this)
    require("./initializers/register_helpers_spec").apply(this)
