"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseTraverse = reverseTraverse;
exports.reverseTraverseRequires = reverseTraverseRequires;
exports.iterateModuleRegistrations = iterateModuleRegistrations;
// Traversal is stopped if `callback` returns `true`
function reverseTraverse(node, callback) {
    for (const property of Object.values(node)) {
        if (property && typeof property === 'object') {
            if (property instanceof Array) {
                if (property.length > 0 && property[0].type) {
                    for (let i = property.length - 1; i >= 0; i--) {
                        if (reverseTraverse(property[i], callback)) {
                            return true;
                        }
                    }
                }
            }
            else if (property.type) {
                if (reverseTraverse(property, callback)) {
                    return true;
                }
            }
        }
    }
    return callback(node) || false;
}
function isRequireCall(node) {
    return (node.type === 'CallExpression' || node.type === 'StringCallExpression')
        && node.base.type === 'Identifier'
        && node.base.name === 'require'
        && (node.type === 'StringCallExpression' || node.arguments.length === 1);
}
function reverseTraverseRequires(node, callback) {
    reverseTraverse(node, node => {
        return isRequireCall(node) && callback(node) === true;
    });
}
function isModuleRegistration(expression, registerIdentifier) {
    return expression.type === 'CallExpression'
        && expression.arguments.length === 2
        && expression.base.type === 'Identifier'
        && expression.base.name === registerIdentifier;
}
function iterateModuleRegistrations(chunk, registerIdentifier, callback) {
    const statementCount = chunk.body.length;
    for (let i = 0; i < statementCount; i++) {
        const node = chunk.body[i];
        if (node.type === 'CallStatement') {
            if (isModuleRegistration(node.expression, registerIdentifier)) {
                const nameArgument = node.expression.arguments[0];
                const bodyArgument = node.expression.arguments[1];
                if (nameArgument.type === 'StringLiteral' && bodyArgument.type === 'FunctionDeclaration') {
                    if (callback(nameArgument.value, bodyArgument)) {
                        return;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=index.js.map