import { expect } from "chai";

const transform = (str) => {
  return require("babel-core").transform(str, {
    plugins: ["../es6/remove-dom-shim"]
  }).code
}

describe('Removes createFactory calls', () => {
  it('converts a wrapped factory to a bare component', () => {
    const code = 'React.createFactory(Component);';
    expect(transform(code)).to.equal('Component;');
  });

  it('leaves other callExpressions intact', () => {
    const code = 'React.doSomething(Component);';
    expect(transform(code)).to.equal('React.doSomething(Component);');

    const noObject = 'doSomething(Component);';
    expect(transform(noObject)).to.equal('doSomething(Component);');
  });
});
