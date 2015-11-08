export default function ({Plugin, types: t}) {
  return new Plugin('arrow-functions', {
    visitor: {
      FunctionExpression: {
        exit: function(node) {
          node.type = "ArrowFunctionExpression";
          return node;
        }
      }
    }
  });
}
