import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        const keystoreFile = tl.getTaskVariable('KEY_FILE_PATH_GOOGLEPLAY');

        if (keystoreFile === undefined) {
            throw new Error('Cannot find the key file path');
        }

        if (keystoreFile && tl.exist(keystoreFile)) {
            fs.unlinkSync(keystoreFile);
            tl.debug('Deleted key file downloaded from the server: ' + keystoreFile);
        }
    } catch (err) {
        tl.warning(tl.loc('DeleteKeyFileFailed', err));
    }
}

run();