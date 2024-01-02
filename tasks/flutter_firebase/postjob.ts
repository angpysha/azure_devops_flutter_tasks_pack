import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        const keystoreFile = tl.getTaskVariable('GOOGLE_SERVICE_ACCOUNT_JSON_PATH');

        if (keystoreFile === undefined) {
            throw new Error('Google service account JSON file is required.');
        }

        if (keystoreFile && tl.exist(keystoreFile)) {
            fs.unlinkSync(keystoreFile);
            tl.debug('Deleted Google Services json from server: ' + keystoreFile);
        }
    } catch (err) {
        tl.warning(tl.loc('Delete Google service account JSON failed', err));
    }
}

run();