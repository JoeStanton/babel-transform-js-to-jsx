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
