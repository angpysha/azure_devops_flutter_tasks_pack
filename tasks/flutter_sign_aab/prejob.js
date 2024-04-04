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
const path = __importStar(require("path"));
const secureFilesCommon = __importStar(require("azure-pipelines-tasks-securefiles-common/securefiles-common"));
const tl = __importStar(require("azure-pipelines-task-lib/task"));
async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        const verbose = tl.getBoolInput('verbose');
        // download keystore file
        const keystoreFileId = tl.getInput('keystoreFile', true);
        if (keystoreFileId === undefined) {
            throw new Error('Keystore file is required');
        }
        const secureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
        const keystoreFilePath = await secureFileHelpers.downloadSecureFile(keystoreFileId);
        if (verbose) {
            console.log('Downloaded keystore file to: ' + keystoreFilePath);
        }
        tl.setTaskVariable('KEYSTORE_FILE_PATH_AAB', keystoreFilePath);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
run();
