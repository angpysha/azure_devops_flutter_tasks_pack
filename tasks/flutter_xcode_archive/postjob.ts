import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'azure-pipelines-task-lib/task';

async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        const keystoreFile = tl.getTaskVariable('EXPORT_OPTIONS_PLIST_PATH');

        if (keystoreFile === undefined) {
            throw new Error('Export options plist is required.');
        }

        if (keystoreFile && tl.exist(keystoreFile)) {
            fs.unlinkSync(keystoreFile);
            tl.debug('Deleted ExportOptions.plist file downloaded from the server: ' + keystoreFile);
        }
    } catch (err) {
        tl.warning(tl.loc('Delete ExportOptions failed', err));
    }
}

run();