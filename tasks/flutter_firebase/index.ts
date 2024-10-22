import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';
import * as fs from 'fs';
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';

type FlutterFirebaseTaskType = 'distribute' | 'uploadIOSSymbols' | 'uploadFlutterDebugInfo' | 'custom';

async function distribute() {
    const filePath = tl.getPathInput('path', true);
    const appId = tl.getInput('appId', true);
    const releaseNotes = tl.getPathInput('releaseNotes', false);
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
    stringBuilder.push(`"${distribuionGroups}"`);

    if (releaseNotes !== undefined) {
        stringBuilder.push('--release-notes');

        var releaseNotesText = fs.readFileSync(releaseNotes, 'utf8');
        releaseNotesText = releaseNotesText.substring(0, 200);
        stringBuilder.push(`"${releaseNotesText}"`);
    }

    const noInteractive = tl.getBoolInput('noInteractive', false);

    if (noInteractive) {
        stringBuilder.push('--no-interactive');
    }

    const args = stringBuilder.join(' ');

    const result = tl.execSync(executable, args);

    if (result.code !== 0) {
        throw new Error(result.stderr);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Firebase distribution succeeded.');
}

async function uploadSymbols() {
    try {

        const googleServicesJsonSecureFilePathId = tl.getInput('googleServicesJson', true);

        if (googleServicesJsonSecureFilePathId === undefined) {
            throw new Error('Google service account credentials JSON is required.');
        }

        const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
        const googleServicesJsonPath: string = await secureFileHelpers.downloadSecureFile(googleServicesJsonSecureFilePathId);



        const uploaderPath = tl.getPathInput('uploaderPath', true);

        if (uploaderPath === undefined) {
            throw new Error('Uploader path is required.');
        }

        if (!fs.existsSync(uploaderPath)) {
            throw new Error('Uploader path does not exist.');
        }

        const symbolsPath = tl.getPathInput('symbolsPath', true);

        if (symbolsPath === undefined) {
            throw new Error('Symbols path is required.');
        }

        if (!fs.existsSync(symbolsPath)) {
            throw new Error('Symbols path does not exist.');
        }

        // Get list of folders in the symbols directory. Because dSYM is a directory
        // and not a file.
        const folders = fs.readdirSync(symbolsPath);

        console.log('Uploading symbols...');
        console.log(`Uploader path: ${uploaderPath}`);
        console.log(`Symbols path: ${symbolsPath}`);
        console.log(`Number of folders: ${folders.length}`);
        console.log(`Folders: ${folders}`);

        // Set executable permissions on the uploader
        fs.chmodSync(uploaderPath, '755');

        for (const symbolFolder of folders) {
            if (symbolFolder.endsWith('.dSYM')) {

                console.log(`Uploading ${symbolFolder}...`);
                let combinedPath = symbolsPath + '/' + symbolFolder;
                const execResult = await uploadItem(uploaderPath, combinedPath, googleServicesJsonPath);
            }
        }

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function uploadItem(uploaderPath: string, symbolPath: string, googleServicesJsonPath: string): Promise<number> {
    const stringBuilder = new Array<string>();

    //stringBuilder.push(uploaderPath);
    stringBuilder.push('-gsp');
    stringBuilder.push(googleServicesJsonPath);
    stringBuilder.push('-p');
    stringBuilder.push('ios');
    stringBuilder.push(symbolPath);

    const args = stringBuilder.join(' ');

    console.log(`Running: ${uploaderPath} ${args}`);
    const result = await tl.exec(uploaderPath, args);
    return result;
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

async function uploadFlutterDebugInfo() {
    try {
        let debugInfoPath = tl.getPathInput('debugInfoPath', true);
        let firebaseAppId = tl.getInput('firebaseAppId', true);
        if (debugInfoPath === undefined) {
            throw new Error('Debug info path is required.');
        }

        if (!fs.existsSync(debugInfoPath)) {
            throw new Error('Debug info path does not exist.');
        }

        if (firebaseAppId === undefined) {
            throw new Error('Firebase App ID is required.');
        }

        const executable = 'firebase';
        const stringBuilder = new Array<string>();

        stringBuilder.push('crashlytics:symbols:upload');
        stringBuilder.push('--app');
        stringBuilder.push(firebaseAppId);
        stringBuilder.push(debugInfoPath);

        const args = stringBuilder.join(' ');

        const result = tl.execSync(executable, args);

        if (result.code !== 0) {
            throw new Error(result.stderr);
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Firebase debug info upload succeeded.');
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function run() {
    try {
        const type = tl.getInput('type', true);

        if (type === undefined) {
            throw new Error('Task type is required');
        }

        let typeEnum: FlutterFirebaseTaskType = type as FlutterFirebaseTaskType;

        var googleAccountCredentialsPath: string | undefined;

        if (type !== 'uploadIOSSymbols' && type !== 'uploadFlutterDebugInfo') {
            const keystoreFileId = tl.getInput('credentials', true);

            if (keystoreFileId === undefined) {
                throw new Error('Google service account credentials JSON is required.');
            }

            const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers(8);
            googleAccountCredentialsPath = await secureFileHelpers.downloadSecureFile(keystoreFileId);

            if (googleAccountCredentialsPath === undefined) {
                throw new Error('Failed to download Google service account credentials JSON.');
            }

            if (fs.existsSync(googleAccountCredentialsPath)) {
                // This way is recommended by Google instead using legacy --token
                tl.setVariable('GOOGLE_APPLICATION_CREDENTIALS', googleAccountCredentialsPath);
            }
        }
        console.log(`Task type: ${type}`);

        if (type === 'distribute') {
            await distribute();
        } else if (type === 'custom') {
            await custom();
        } else if (type === 'uploadIOSSymbols') {
            await uploadSymbols();
        } else if (type === 'uploadFlutterDebugInfo') {
            await uploadFlutterDebugInfo();
        }

        if (googleAccountCredentialsPath !== undefined) {
            fs.unlinkSync(googleAccountCredentialsPath);
        }

        tl.setVariable('GOOGLE_APPLICATION_CREDENTIALS', '');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

