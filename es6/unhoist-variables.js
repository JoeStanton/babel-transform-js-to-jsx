export default function ({types: t}) {
  return {
    visitor: {
      SequenceExpression(path) {
        const assignments = path.node.expressions;

        if (assignments.filter(t.isAssignmentExpression).length !== assignments.length) {
          return;
        }

        let nextPath = path.parentPath;
        assignments.forEach((node) => {
          nextPath = nextPath.insertAfter(t.expressionStatement(node))[0];
        });

        path.remove();
      },

      ExpressionStatement(path) {
        if (!t.isAssignmentExpression(path.node.expression)) { return; }

        const left = path.node.expression.left;
        const binding = path.scope.bindings[left.name];

        if (binding && !binding.path.shouldSkip) {
          path.replaceWith(
            t.variableDeclaration("var", [t.VariableDeclarator(left, path.node.expression.right)])
          );

          binding.path.remove();
        }
      }
    }
  };
}
