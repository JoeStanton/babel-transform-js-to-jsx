export default function ({types: t}) {
  return {
    visitor: {
      VariableDeclaration: function(path) {
        const declaration = path.node.declarations[0];
        if (!(t.isCallExpression(declaration.init) && declaration.init.callee.name === 'require') || !t.isProgram(path.parentPath.node)) {
          return;
        }
        const identifier = declaration.id;
        const from = declaration.init.arguments[0];

        path.replaceWith(
          t.ImportDeclaration(
            [t.importDefaultSpecifier(identifier)],
            from
          )
        );
      },
      SequenceExpression(path) {
        const assignments = path.node.expressions;

        if (assignments.filter(t.isAssignmentExpression).length !== assignments.length) {
          return;
        }

        if (assignments[0].right.callee.name !== "require" && assignments < 2) {
          return;
        }

        let module = assignments[0].right.arguments[0];
        let destructured = assignments.slice(1).map(assignment => assignment.left.name);

        let first = t.ImportDeclaration(
          [t.importDefaultSpecifier(t.identifier("{ " + destructured.join(", ") + " }"))],
          module
        );

        path.parentPath.insertAfter(first);
        path.remove();
      },
      AssignmentExpression: function(path) {
        if (!(t.isCallExpression(path.node.right) && path.node.right.callee.name === 'require') || !t.isProgram(path.parentPath.parentPath.node)) {
          return;
        }

        const identifier = path.node.left;
        const from = path.node.right.arguments[0];
        path.scope.bindings[identifier.name].path.remove();

        path.parentPath.replaceWith(
          t.ImportDeclaration(
            [t.importDefaultSpecifier(identifier)],
            from
          )
        );
      },
      CallExpression: function(path) {
        if (path.node.callee.name !== 'require' || t.isMemberExpression(path.parentPath.node) || !t.isProgram(path.parentPath.parentPath.node)) {
          return;
        }

        path.parentPath.replaceWith(
          t.ImportDeclaration(
            [],
            path.node.arguments[0]
          )
        );
      }
    }
  }
}
