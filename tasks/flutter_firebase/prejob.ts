import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';
import tr = require('azure-pipelines-task-lib/toolrunner');
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';
import { async } from 'q';

async function run() {
    try {

        const keystoreFileId = tl.getInput('credentials', true);

        if (keystoreFileId === undefined) {
            throw new Error('Google service account credentials JSON is required.');
        }

        const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
        const keystoreFilePath: string = await secureFileHelpers.downloadSecureFile(keystoreFileId);
        tl.setTaskVariable('GOOGLE_SERVICE_ACCOUNT_JSON_PATH', keystoreFilePath);

    } catch (err) {
        tl.warning(tl.loc('Downloading ExportOptions.plist failed', err));
    }
}

run();