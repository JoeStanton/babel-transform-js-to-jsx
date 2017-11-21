import { expect } from "chai";
import dedent from "dedent";

const transform = (str) => {
  return require("babel-core").transform(str, {
    plugins: ["../es6/modules", "../es6/arrow-functions"]
  }).code
}

describe('CommonJS -> ES6 imports', () => {
  it('converts a standard statement', () => {
    const code = 'var React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  });

  it('converts an assignment', () => {
    const code = 'var React; React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  });

  it('converts a require without assignment', () => {
    const code = 'require("react");';
    expect(transform(code)).to.equal('import "react";');
  });

  it('leaves destructuring requires alone', () => {
    const code = 'require("react").something;';
    expect(transform(code)).to.equal('require("react").something;');
  });

  it('converts destructure sequences', () => {
    const code = '$ref = require("react"), fn1 = $ref.fn1, fn2 = $ref.fn2;';
    expect(transform(code)).to.equal('import { fn1, fn2 } from "react";');
  });
});

describe('Arrow functions', () => {
  it('converts FunctionExpression to arrow', () => {
    const code = '(function() {})';
    expect(transform(code)).to.equal('() => {};');
  });

  it('with parameters', () => {
    const code = '(function(a, b) {})';
    expect(transform(code)).to.equal('(a, b) => {};');
  });

  it('with return', () => {
    const code = '(function(a, b) { return a + b; })';
    expect(transform(code)).to.equal(
      dedent`
        (a, b) => {
          return a + b;
        };
      `
    );
  });

  it('bails out when `this` is used', () => {
    const code = '(function () {  this.a;});';
    expect(transform(code).replace(/\n/g, '')).to.equal(code);
  })
});
