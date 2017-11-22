import { expect } from "chai";
import dedent from "dedent";

const transform = (str) => {
  return require("babel-core").transform(str, {
    plugins: ["../es6/var-to-const"]
  }).code
}

describe('var -> const', () => {
  it('converts vars to const', () => {
    const code = 'var foo = "bar";';
    expect(transform(code)).to.equal('const foo = "bar";');
  });

  it('converts assignments sequences', () => {
    const code = 'var foo = "bar", baz ="quux"';
    const transformed =
      `const foo = "bar",
      baz = "quux";`;
    expect(transform(code)).to.equal(transformed);
  });

  it('removes var declarations', () => {
    const code = 'var foo, bar;';
    expect(transform(code)).to.equal('');
  });
});

