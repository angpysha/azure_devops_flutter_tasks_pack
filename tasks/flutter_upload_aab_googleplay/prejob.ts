import * as path from 'path';
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        const verbose: boolean = tl.getBoolInput('verbose');

        // download key file
        const keyFileId = tl.getInput('keyFile', true);

        if (keyFileId === undefined) {
            throw new Error('Key file is required');
        }

        const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
        const keyFilePath: string = await secureFileHelpers.downloadSecureFile(keyFileId);

        if (verbose) {
            console.log('Downloaded key file to: ' + keyFilePath);
        }

        tl.setTaskVariable('KEY_FILE_PATH_GOOGLEPLAY', keyFilePath);
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();