export default function ({types: t}) {
  return {
    visitor: {
      VariableDeclaration: function(path) {
        const declaration = path.node.declarations[0];
        if (!(t.isCallExpression(declaration.init) && declaration.init.callee.name === 'require')) {
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
      AssignmentExpression: function(path) {
        if (!(t.isCallExpression(path.node.right) && path.node.right.callee.name === 'require')) {
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
        if (!(path.node.callee.name === 'require')) {
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
