module.exports =

  initializeTemplates: (templatePath='', templates={}) ->
    @templatePath ||= templatePath
    @templates = _.extend({}, @templates, templates)

  getTemplate: (path) ->
    @templates["#{@templatePath}#{path}"]
