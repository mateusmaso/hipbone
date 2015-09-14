# class App extends Hipbone.Application
#
# class App.Book extends Hipbone.Model
#   mappings:
#     pages: "Pages"
#   computedAttributes:
#     full_title: "fullTitle"
#     fullTitle: -> "#{@get("title")} by #{@get("author")}"
#
# class App.Page extends Hipbone.Model
#   urlRoot: "/pages"
#   mappings:
#     book: "Book"
#   polymorphics: ["top_annotation"]
#   validations:
#     text: (text) -> not _.string.isBlank(text)
#
# class App.ReaderAnnotation extends Hipbone.Model
#   urlRoot: "/annotations"
#   filters:
#     reader: true
#
# class App.AuthorAnnotation extends Hipbone.Model
#
# class App.ReaderAnnotations extends Hipbone.Collection
#   urlRoot: "/annotations"
#   filters:
#     reader: true
#   pagination:
#     offset: 0
#     limit: 10
#
# class App.Annotations extends Hipbone.Collection
#   urlRoot: "/annotations"
#
# class App.Books extends Hipbone.Collection
#
# class App.Pages extends Hipbone.Collection
#   model: App.Page
#
# class App.BookRoute extends Hipbone.Route
#
# class App.BookView extends Hipbone.View
#   defaults:
#     copyright: false
#     title: "Unknown"
#
# module.exports = App
