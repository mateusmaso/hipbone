module.exports = class View extends Hipbone.View

  templatePath: "app/templates"

  templates: require("./../templates").Templates

  @register "View"
