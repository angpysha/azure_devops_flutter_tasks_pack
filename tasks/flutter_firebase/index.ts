import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';
import * as fs from 'fs';

async function distribute() {
   const filePath = tl.getPathInput('path', true);
   const appId = tl.getInput('appId', true);
   const releaseNotes = tl.getInput('releaseNotes', false);
   const distribuionGroups = tl.getInput('groups', true);

    if (filePath === undefined) {
         throw new Error('File path is required.');
    }

    if (appId === undefined) {
        throw new Error('App ID is required.');
    }

    if (distribuionGroups === undefined) {
        throw new Error('Distribution groups are required.');
    }

    const executable = 'firebase';

    const stringBuilder = new Array<string>();

    stringBuilder.push('appdistribution:distribute');

    stringBuilder.push(filePath);

    stringBuilder.push('--app');
    stringBuilder.push(appId);

    stringBuilder.push('--groups');
    stringBuilder.push(distribuionGroups);

    if (releaseNotes !== undefined) {
        stringBuilder.push('--release-notes');
        stringBuilder.push(releaseNotes);
    }

    stringBuilder.push('--no-interactive');

    const args = stringBuilder.join(' ');

    const result = tl.execSync(executable, args);

    if (result.code !== 0) {
        throw new Error(result.stderr);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Firebase distribution succeeded.');
}

async function custom() {
    const executable = 'firebase';

    const args = tl.getInput('args', true);

    if (args === undefined) {
        throw new Error('Arguments are required.');
    }

    const result = tl.execSync(executable, args);

    if (result.code !== 0) {
        throw new Error(result.stderr);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Firebase command succeeded.');
}

async function run() {
    try {

        const googleServicesJsonPath = tl.getTaskVariable('GOOGLE_SERVICE_ACCOUNT_JSON_PATH');

        if (googleServicesJsonPath === undefined) {
            throw new Error('Google service account JSON file is required.');
        }

        if (fs.existsSync(googleServicesJsonPath)) {
            //This way is recommended by Google instead using legacy --token
            tl.setVariable('GOOGLE_APPLICATION_CREDENTIALS', googleServicesJsonPath);
        }

        const type = tl.getInput('type', true);

        if (type === undefined) {
            throw new Error('Task type is required');
        }

        if (type === 'distribute') {
            await distribute();
        } else if (type === 'custom') {
            await custom();
        }

        tl.setVariable('GOOGLE_APPLICATION_CREDENTIALS', '');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

