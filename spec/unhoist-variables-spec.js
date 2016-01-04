import { expect } from "chai";
import dedent from "dedent";

const transform = (str) => {
  return require("babel-core").transform(str, {
    plugins: ["../es6/unhoist-variables"]
  }).code
}

describe('Variable unhoisting', () => {
  it('unhoists variables within the same scope', () => {
    const code =
      dedent`
        var a;
        var b;

        a = 2;
        b = 3;
        c = 2;
      `

    const transformed =
      dedent`
        var a = 2;
        var b = 3;

        c = 2;
      `

    expect(transform(code)).to.equal(transformed);
  });

  it('handles sequence expressions', () => {
    const code =
      dedent`
        var a, b, c, d;

        a = 1, b = 2, c = 3, d = 4;
      `

    const transformed =
      dedent`
        var a = 1;
        var b = 2;
        var c = 3;
        var d = 4;
      `

    expect(transform(code)).to.equal(transformed);
  });

  it('does not unhoist variables when assignment is in different scope', () => {
    const code =
      dedent`
        var a;

        function b() {
          a = 3;
        }

        function c() {
          a = 4;
        }
      `
    expect(transform(code)).to.equal(code);
  });

  it('leaves mixed sequence expressions untouched', () => {
    const code =
      dedent`
        var a, b, c, d;

        a = 1, b = 2, 2 * 2, 3 * 3;
      `

    expect(transform(code)).to.equal(code);
  });
});
