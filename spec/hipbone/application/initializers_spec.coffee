module.exports = ->
  describe "initializers", ->
    it "should extend and run initializers with options as default", ->
      class App extends Hipbone.Application
        output: []
        initializers: [-> @output.push("foo")]
      initializer = (options={}) -> @output.push("bar") if options.bar
      app = new App(bar: true, initializers: [initializer])
      chai.expect(app.output).to.be.deep.equal(["foo", "bar"])

    require("./initializers/sync_spec").apply(this)
    require("./initializers/register_modules_spec").apply(this)
    require("./initializers/register_elements_spec").apply(this)
    require("./initializers/register_helpers_spec").apply(this)
    require("./initializers/parse_body_spec").apply(this)
    require("./initializers/parse_model_spec").apply(this)
    require("./initializers/link_bridge_spec").apply(this)
    require("./initializers/prevent_form_spec").apply(this)
    require("./initializers/start_history_spec").apply(this)
