"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMetadata = void 0;
exports.generateMetadata = generateMetadata;
exports.readMetadata = readMetadata;
const package_json_1 = require("../package.json");
const options_1 = require("../bundle/options");
const MalformedBundleError_1 = __importDefault(require("../errors/MalformedBundleError"));
exports.defaultMetadata = {
    identifiers: options_1.defaultOptions.identifiers,
    luaVersion: options_1.defaultOptions.luaVersion,
    rootModuleName: options_1.defaultOptions.rootModuleName,
    version: package_json_1.version
};
function intersectionDiff(a, subset) {
    const diff = {};
    for (const key of Object.keys(subset)) {
        const setValue = a[key];
        const subsetValue = subset[key];
        if (setValue !== undefined && subsetValue !== undefined && setValue !== subsetValue) {
            if (setValue
                && typeof setValue === 'object'
                && !(setValue instanceof Array)
                && subsetValue
                && typeof subsetValue === 'object'
                && !(subsetValue instanceof Array)) {
                const recursiveDiff = intersectionDiff(setValue, subsetValue);
                if (Object.entries(recursiveDiff).length > 0) {
                    diff[key] = recursiveDiff;
                }
            }
            else {
                diff[key] = subsetValue;
            }
        }
    }
    return diff;
}
function generateMetadata(options) {
    const metadata = intersectionDiff(exports.defaultMetadata, options);
    metadata.version = package_json_1.version;
    return `-- Bundled by luabundle ${JSON.stringify(metadata)}\n`;
}
function parseMetadata(line) {
    const match = line.match(/^-- Bundled by luabundle ({.+})$/);
    if (match) {
        const metadata = JSON.parse(match[1]);
        if (!metadata['version']) {
            throw new MalformedBundleError_1.default('Bundle contains invalid metadata');
        }
        return metadata;
    }
    return null;
}
function readMetadata(lua) {
    // We'll allow users to inject comments and blank lines above our header, but that's it (no code).
    for (let [start, end] = [0, lua.indexOf('\n')]; end !== -1; start = end + 1, end = lua.indexOf('\n', start)) {
        const line = lua.substring(start, end);
        if (line.length > 0 && !line.startsWith("--")) {
            break;
        }
        const metadata = parseMetadata(line);
        if (metadata) {
            return metadata;
        }
    }
    return null;
}
//# sourceMappingURL=index.js.map