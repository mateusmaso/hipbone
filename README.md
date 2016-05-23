hipbone [![Build Status](https://travis-ci.org/mateusmaso/hipbone.svg?branch=master)](https://travis-ci.org/mateusmaso/hipbone)
==============

Hipbone is a Backbone based framework for building Single Page Applications.

<img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Hip_bone.png" width=100 />

## Install

```
$ npm install --save hipbone
```

## Folder Structure

```
.
|-- models
|-- collections
|-- views
|-- templates
|-- locales
|   `-- en.coffee
|-- initializers
|   `-- match_routes.coffee
`-- app.coffee
```

## Usage

```javascript
var App = require("./app");
var app = new App();
app.run();
```

## Examples

#### [TodoMVC](https://www.github.com/mateusmaso/hipbone/tree/master/examples/todomvc)

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)
