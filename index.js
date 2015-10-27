let {DOM} = require("react");

export default function ({Plugin, types: t}) {
  return new Plugin('js-to-jsx', {
    visitor: {
      CallExpression: {
        enter: function (node, parent) {
          if (Object.keys(DOM).indexOf(node.callee.name) === -1) return node;

          var props = (node.arguments[0].properties || []).map(prop => {
            var value = t.isLiteral(prop.value) ? prop.value : t.JSXExpressionContainer(prop.value);
            return t.JSXAttribute(prop.key, value);
          });
          var children = node.arguments.slice(1);

          var name = t.JSXIdentifier();
          name.name = node.callee.name;

          var open = t.JSXOpeningElement(name, props);
          open.selfClosing = children.length === 0;
          var close = children.length === 0 ? null : t.JSXClosingElement(name);

          var el = t.JSXElement(open, close, children);
          return parent.type === 'ReturnStatement' ? t.ParenthesizedExpression(el) : t.ExpressionStatement(el);
        }
      },
      JSXElement: {
        exit: function(node) {
          node.children = node.children.map(c => {
            if (t.isJSXElement(c) || t.isLiteral(c) || t.isJSXExpressionContainer(c)) {
              return c;
            } else {
              t.JSXExpressionContainer(c)
            }
          });
        }
      }
    }
  });
}
