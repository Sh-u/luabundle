"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbundleString = unbundleString;
exports.unbundle = unbundle;
const fs_1 = require("fs");
const metadata_1 = require("../metadata");
const process_1 = require("./process");
const MalformedBundleError_1 = __importDefault(require("../errors/MalformedBundleError"));
const NoBundleMetadataError_1 = __importDefault(require("../errors/NoBundleMetadataError"));
const defaultOptions = {
    rootOnly: false,
};
function mergeOptions(options) {
    return Object.assign(Object.assign({}, defaultOptions), options);
}
function mergeMetadata(metadata) {
    return Object.assign(Object.assign(Object.assign({}, metadata_1.defaultMetadata), metadata), { identifiers: Object.assign(Object.assign({}, metadata_1.defaultMetadata.identifiers), metadata.identifiers) });
}
function unbundleString(lua, options = {}) {
    const metadata = (0, metadata_1.readMetadata)(lua);
    if (!metadata) {
        throw new NoBundleMetadataError_1.default();
    }
    const realizedOptions = mergeOptions(options);
    const realizedMetadata = mergeMetadata(metadata);
    const modules = (0, process_1.processModules)(lua, realizedMetadata, realizedOptions);
    const rootModule = modules[realizedMetadata.rootModuleName];
    if (!rootModule) {
        throw new MalformedBundleError_1.default(`Root module '${realizedMetadata.rootModuleName}' not found.`);
    }
    return {
        metadata: realizedMetadata,
        modules,
    };
}
function unbundle(inputFilePath, options = {}) {
    const lua = (0, fs_1.readFileSync)(inputFilePath, 'utf8');
    return unbundleString(lua, options);
}
//# sourceMappingURL=index.js.map