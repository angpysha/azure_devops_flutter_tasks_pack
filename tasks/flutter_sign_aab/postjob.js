"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tl = __importStar(require("azure-pipelines-task-lib/task"));
async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        const keystoreFile = tl.getTaskVariable('KEYSTORE_FILE_PATH_AAB');
        if (keystoreFile === undefined) {
            throw new Error('Keystore file is required');
        }
        if (keystoreFile && tl.exist(keystoreFile)) {
            fs.unlinkSync(keystoreFile);
            tl.debug('Deleted keystore file downloaded from the server: ' + keystoreFile);
        }
    }
    catch (err) {
        tl.warning(tl.loc('DeleteKeystoreFileFailed', err));
    }
}
run();
