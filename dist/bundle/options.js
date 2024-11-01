"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
exports.defaultOptions = {
    force: false,
    identifiers: {
        register: '__bundle_register',
        require: '__bundle_require',
        loaded: '__bundle_loaded',
        modules: '__bundle_modules',
    },
    isolate: false,
    luaVersion: '5.3',
    metadata: true,
    paths: ['?', '?.lua'],
    rootModuleName: '__root',
    ignoredModuleNames: [],
    resolveModule: undefined,
    sourceEncoding: 'utf8',
    callRoot: true,
    customRequireFn: undefined,
};
//# sourceMappingURL=options.js.map