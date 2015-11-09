export default function ({types: t}) {
  return {
    visitor: {
      FunctionExpression: {
        exit: function (path) {
          if (!path.getData("hasThis")) {
            path.node.type = "ArrowFunctionExpression";
          }
        }
      },
      ThisExpression: function(path) {
        const func = path.find((path) => (path.isFunction() && !path.isArrowFunctionExpression()) || path.isProgram());
        if (func) {
          func.setData("hasThis", true);
        }
      }
    }
  }
}
