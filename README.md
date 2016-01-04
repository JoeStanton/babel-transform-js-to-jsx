JS to JSX
=========

[![Circle CI](https://circleci.com/gh/JoeStanton/babel-js-to-jsx.svg?style=svg)](https://circleci.com/gh/JoeStanton/babel-js-to-jsx)

Babel 6 plugin to convert from desugared React.DOM CallExpressions -> the equivalent JSX. Currently used to migrate to ES6+ from other compile to JS languages.

It can be used as a plugin:

```js
require("babel-core").transform(code, {
  plugins: ["js-to-jsx", "syntax-jsx"],
}).code
```

Or from the command line for composition with other tools:

```bash
npm install babel-js-to-jsx
cat example.ls | lsc -cb --no-header | js-to-jsx | esformatter -c format.json
```

###ES6

As this plugin aims to help upgrades to ES6, it also contains the following **opt-in** transforms:

* Functions -> Arrow Functions, if `this` is not used.
* CommonJS -> ES6 imports
* Removal of React.createFactory

They can be used like this:

```js
require("babel-core").transform(code, {
  plugins: [
    "js-to-jsx",
    "js-to-jsx/es6/modules",
    "js-to-jsx/es6/arrow-functions",
    "js-to-jsx/es6/remove-dom-shim",
    "js-to-jsx/es6/unhoist-variables",
    "syntax-jsx"
  ]
}).code
```
