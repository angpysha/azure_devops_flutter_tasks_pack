import * as path from 'path';
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        const verbose: boolean = tl.getBoolInput('verbose');

        // download keystore file
        const keystoreFileId = tl.getInput('keystoreFile', true);

        if (keystoreFileId === undefined) {
            throw new Error('Keystore file is required');
        }

        const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
        const keystoreFilePath: string = await secureFileHelpers.downloadSecureFile(keystoreFileId);

        if (verbose) {
            console.log('Downloaded keystore file to: ' + keystoreFilePath);
        }

        tl.setTaskVariable('KEYSTORE_FILE_PATH_AAB', keystoreFilePath);
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();