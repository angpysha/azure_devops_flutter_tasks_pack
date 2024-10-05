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
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const secureFilesCommon = __importStar(require("azure-pipelines-tasks-securefiles-common/securefiles-common"));
async function run() {
    try {
        const type = tl.getInput('taskType', true);
        const verbose = tl.getBoolInput('verbose', true);
        if (type === 'export') {
            if (verbose) {
                console.log('Prejob for export task');
            }
            const keystoreFileId = tl.getInput('exportOptionsPlist', true);
            if (keystoreFileId === undefined) {
                throw new Error('Export options plist is required.');
            }
            if (verbose) {
                console.log(`Downloading ExportOptions.plist file with id ${keystoreFileId}`);
            }
            const secureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
            const keystoreFilePath = await secureFileHelpers.downloadSecureFile(keystoreFileId);
            tl.setTaskVariable('EXPORT_OPTIONS_PLIST_PATH', keystoreFilePath);
        }
    }
    catch (err) {
        tl.warning(tl.loc('Downloading ExportOptions.plist failed', err));
    }
}
run();
