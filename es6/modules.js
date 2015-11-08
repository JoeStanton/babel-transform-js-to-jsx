export default function ({Plugin, types: t}) {
  return new Plugin('5to6', {
    visitor: {
      VariableDeclaration: function(node) {
        const declaration = node.declarations[0];
        if (!(t.isCallExpression(declaration.init) && declaration.init.callee.name === 'require')) {
          console.log((declaration));
          return node;
        }
        const identifier = declaration.id;
        const from = declaration.init.arguments[0];

        return t.ImportDeclaration(
          [t.importDefaultSpecifier(identifier)],
          from
        );
      },
      AssignmentExpression: function(node) {
        if (!(t.isCallExpression(node.right) && node.right.callee.name === 'require')) {
          return node;
        }
        const identifier = node.left;
        const from = node.right.arguments[0];

        return t.ImportDeclaration(
          [t.importDefaultSpecifier(identifier)],
          from
        );
      },
      CallExpression: function(node) {
        if (!(node.callee.name === 'require')) {
          return node;
        }

        return t.ImportDeclaration(
          [],
          node.arguments[0]
        );
      }
    }
  });
}
