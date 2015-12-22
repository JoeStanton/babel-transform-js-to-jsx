export default function ({types: t}) {
  return {
    visitor: {
      CallExpression(path) {
        const {object, property} = path.node.callee;
        if (object && object.name === "React" &&
            property && property.name === "createFactory")
        {
          path.replaceWith(path.node.arguments[0]);
        }
      }
    }
  };
}
