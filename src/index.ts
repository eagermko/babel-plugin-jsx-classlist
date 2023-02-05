import babel, { PluginObj, types } from '@babel/core';

type AttrsNodePath = babel.NodePath<babel.types.JSXAttribute>;

function extractExpressionOrStringLiteral(node?: babel.types.JSXAttribute) {
  if (!node) return undefined;

  if (node.value?.type === 'StringLiteral') return node.value;
  if (node.value?.type === 'JSXExpressionContainer') {
    if (node.value.expression.type !== 'JSXEmptyExpression') {
      return node.value.expression;
    }
  }

  return undefined;
}

export default ({ types }: typeof babel): PluginObj => {
  let shouldInject = false;

  return {
    visitor: {
      Program: {
        enter(program) {
          shouldInject = false;
        },
        exit(program) {
          if (!shouldInject) return;

          const identifier = types.identifier('__clx');
          const importDefaultSpecifier =
            types.importDefaultSpecifier(identifier);
          const importDeclaration = types.importDeclaration(
            [importDefaultSpecifier],
            types.stringLiteral('classnames')
          );

          program!.unshiftContainer('body', importDeclaration);
        },
      },
      JSXAttribute(classListPath) {
        if (classListPath.node.name.name !== 'classList') return;
        const classnames = types.identifier('__clx');

        const attrs = classListPath.parentPath.get(
          'attributes'
        ) as AttrsNodePath[];

        const classNamePath = attrs.find(
          (path) => path.node.name.name === 'className'
        );

        const classNameNode = classNamePath?.node;

        const _arguments = [
          extractExpressionOrStringLiteral(classNameNode),
          extractExpressionOrStringLiteral(classListPath.node),
        ].filter((v): v is babel.types.Expression => !!v);

        const allStringLiteral = _arguments.every(
          (exp): exp is babel.types.StringLiteral =>
            exp.type === 'StringLiteral'
        );

        if (allStringLiteral) {
          const concatClassName = _arguments.map((v) => v.value).join(' ');
          classListPath.node.value = types.stringLiteral(concatClassName);
        } else {
          const expression = types.callExpression(classnames, _arguments);
          classListPath.node.value = types.jsxExpressionContainer(expression);
          shouldInject = true;
        }

        classListPath.node.name.name = 'className';
        classNamePath?.remove();
      },
    },
  };
};
