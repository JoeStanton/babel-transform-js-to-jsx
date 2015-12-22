let {DOM} = require("react");

export default function ({types: t}) {
  const getAttributes = (props) => {
    if (t.isIdentifier(props) || t.isMemberExpression(props)) {
      return [t.JSXSpreadAttribute(props)];
    }

    return (props && props.properties || []).map(prop => {
      const key = t.JSXIdentifier(prop.key.name || prop.key.value)
      const value = t.isLiteral(prop.value) && (typeof prop.value.value === 'string') ? prop.value : t.JSXExpressionContainer(prop.value);
      return t.JSXAttribute(key, value);
    });
  }

  const processChildren = (children) => {
    return children.map(c => {
      if (t.isJSXElement(c) || t.isStringLiteral(c) || t.isJSXExpressionContainer(c)) {
        return c;
      } else {
        return t.JSXExpressionContainer(c);
      }
    });
  }

  return {
    visitor: {
      CallExpression: {
        exit: function (path, state) {
          if (Object.keys(DOM).concat(state.opts.components || []).indexOf(path.node.callee.name) === -1) return;

          var props = getAttributes(path.node.arguments[0]);
          var children = processChildren(path.node.arguments.slice(1));

          var name = t.JSXIdentifier(path.node.callee.name);

          var open = t.JSXOpeningElement(name, props);
          open.selfClosing = children.length === 0;
          var close = children.length === 0 ? null : t.JSXClosingElement(name);

          var el = t.JSXElement(open, close, children);
          path.replaceWith(path.parent.type === 'ReturnStatement' ? t.ParenthesizedExpression(el) : t.ExpressionStatement(el));
        }
      },
      ConditionalExpression: function(path) {
        if (path.node.alternate.operator === 'void') {
          path.replaceWith(t.LogicalExpression("&&", path.node.test, path.node.consequent));
        }
      }
    }
  }
}
