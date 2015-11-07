let {DOM} = require("react");

export default function ({Plugin, types: t}) {
  const getAttributes = (props) => {
    if (t.isIdentifier(props)) {
      return [t.JSXSpreadAttribute(props)];
    }

    return (props && props.properties || []).map(prop => {
      var value = t.isLiteral(prop.value) && (typeof prop.value.value === 'string') ? prop.value : t.JSXExpressionContainer(prop.value);
      return t.JSXAttribute(prop.key, value);
    });
  }

  return new Plugin('js-to-jsx', {
    visitor: {
      CallExpression: {
        enter: function (node, parent) {
          if (Object.keys(DOM).indexOf(node.callee.name) === -1) return node;

          var props = getAttributes(node.arguments[0]);
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
              return t.JSXExpressionContainer(c);
            }
          });
        }
      }
    }
  });
}
