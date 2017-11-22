export default function ({types: t}) {
  return {
    visitor: {
      VariableDeclaration(path) {
        const declarations = path.node.declarations;

        if (path.node.declarations.filter(dec => !dec.init).length === declarations.length) {
          path.remove();
          return;
        }

        if (path.node.declarations.filter(dec => !!dec.init).length !== declarations.length) {
          return;
        }

        path.node.kind = "const";
      }
    }
  };
}
