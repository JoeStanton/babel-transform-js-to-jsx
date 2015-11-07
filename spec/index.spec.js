import { expect } from "chai";

const transform = (str) => {
  return require("babel").transform(str, {
    plugins: [require("..")],
    blacklist: ["react"],
  }).code.replace("\"use strict\";\n\n", "")
}

describe('JSX Elements', () => {
  it('No children', () => {
    expect(transform('div()')).to.equal('<div />;');
  });

  it('With text child', () => {
    const code = 'div(null, "Hello")';
    expect(transform(code)).to.equal('<div>Hello</div>;');
  });

  it('With element child', () => {
    const code = 'div(null, div())';
    expect(transform(code)).to.equal('<div><div /></div>;');
  });

  it('With expression child', () => {
    const code = 'div(null, array.map(OtherComponent))';
    expect(transform(code)).to.equal('<div>{array.map(OtherComponent)}</div>;');
  });
});

describe('JSX Attributes', () => {
  it('With literal prop', () => {
    const code = 'div({a: "b"})';
    expect(transform(code)).to.equal('<div a="b" />;');
  });

  it('With numeric prop', () => {
    const code = 'div({a: 1})';
    expect(transform(code)).to.equal('<div a={1} />;');
  })

  it('With expression prop', () => {
    const code = 'div({a: b})';
    expect(transform(code)).to.equal('<div a={b} />;');
  })

  it('With mix of props', () => {
    const code = 'div({a: b, b: "c"})';
    expect(transform(code)).to.equal('<div a={b} b="c" />;');
  })

  it('With object prop', () => {
    const code = 'div(props)';
    expect(transform(code)).to.equal('<div {...props} />;');
  })
});
