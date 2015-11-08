export default function ({types: t}) {
  return {
    visitor: {
      FunctionExpression: {
        exit: function(path) {
          path.node.type = "ArrowFunctionExpression";
        }
      }
    }
  }
}
