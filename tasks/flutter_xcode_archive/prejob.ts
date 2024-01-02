import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';
import tr = require('azure-pipelines-task-lib/toolrunner');
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';
import { async } from 'q';

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

            const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
            const keystoreFilePath: string = await secureFileHelpers.downloadSecureFile(keystoreFileId);
            tl.setTaskVariable('EXPORT_OPTIONS_PLIST_PATH', keystoreFilePath);
        }
    } catch (err) {
        tl.warning(tl.loc('Downloading ExportOptions.plist failed', err));
    }
}

run();