import { expect } from "chai";

const transform = (str) => {
  return require("babel").transform(str, {
    plugins: [require("../es6/modules")],
    blacklist: ["es6.modules"],
  }).code.replace("\"use strict\";\n\n", "")
}

describe('CommonJS -> ES6 imports', () => {
  it('Should convert a standard statement', () => {
    const code = 'var React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  });

  it('Should convert an assignment', () => {
    const code = 'React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  })

  it('Should convert a require without assignment', () => {
    const code = 'require("react");';
    expect(transform(code)).to.equal('import "react";');
  })
});
