"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processModules = processModules;
const moonsharp_luaparse_1 = require("moonsharp-luaparse");
const ast_1 = require("../ast");
const MalformedBundleError_1 = __importDefault(require("../errors/MalformedBundleError"));
function extractModule(lua, name, declaration) {
    if (declaration.parameters.length !== 4) {
        throw new MalformedBundleError_1.default('Module function declaration contained unexpected number of parameters.');
    }
    // luaparse does not included comments in the body, even if you enable
    // comment parsing. However, we don't want to remove user's comments,
    // thus...
    const startIndex = declaration.parameters[3].range[1] + ')\n'.length;
    const endIndex = declaration.range[1] - '\nend'.length;
    const content = lua.substring(startIndex, endIndex);
    return {
        name,
        content,
        start: {
            index: startIndex,
            line: declaration.loc.start.line + 1,
            column: 0,
        },
        end: {
            index: endIndex,
            line: declaration.loc.end.line - 1,
            column: content.length - content.lastIndexOf('\n') - 1
        }
    };
}
function processModules(lua, metadata, options) {
    const modules = {};
    const ast = (0, moonsharp_luaparse_1.parse)(lua, {
        locations: true,
        luaVersion: metadata.luaVersion,
        ranges: true,
    });
    (0, ast_1.iterateModuleRegistrations)(ast, metadata.identifiers.register, (name, body) => {
        if (options.rootOnly && name !== metadata.rootModuleName) {
            return;
        }
        modules[name] = extractModule(lua, name, body);
        if (options.rootOnly) {
            return true;
        }
    });
    return modules;
}
//# sourceMappingURL=process.js.map