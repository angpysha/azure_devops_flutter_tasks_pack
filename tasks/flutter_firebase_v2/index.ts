import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';
import * as fs from 'fs';
import * as path from 'path';
import * as secureFilesCommon from 'azure-pipelines-tasks-securefiles-common/securefiles-common';

/** Reads GCP service account JSON from the custom certificate-based service connection. */
function readServiceAccountJsonFromServiceConnection(serviceConnection: string): string {
    let jsonContent = tl.getEndpointAuthorizationParameter(serviceConnection, 'certificate', false);
    if (!jsonContent || jsonContent.trim() === '') {
        const auth = tl.getEndpointAuthorization(serviceConnection, false);
        if (auth?.parameters) {
            const parameters = auth.parameters as Record<string, string>;
            jsonContent =
                parameters['certificate'] ||
                parameters['Certificate'] ||
                '';
        }
    }
    if (!jsonContent || jsonContent.trim() === '') {
        throw new Error('Service connection does not contain service account JSON (certificate field).');
    }
    return jsonContent;
}

/** Writes JSON to a private temp file for GOOGLE_APPLICATION_CREDENTIALS. */
function writeServiceAccountCredentialsFile(jsonContent: string): string {
    const agentTemp = tl.getVariable('Agent.TempDirectory');
    if (!agentTemp) {
        throw new Error('Agent.TempDirectory is not set; cannot write credentials file.');
    }
    const credPath = path.join(agentTemp, `flutter-firebase-gcp-sa-${process.pid}-${Date.now()}.json`);
    fs.writeFileSync(credPath, jsonContent, { encoding: 'utf8', mode: 0o600 });
    return credPath;
}
const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let activeToolRunner: any;

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

    let toolRunner = tl.tool(executable);

    toolRunner.arg('appdistribution:distribute');
    toolRunner.arg(filePath);

    toolRunner.arg('--app');
    toolRunner.arg(appId);

    toolRunner.arg('--groups');
    toolRunner.arg(distribuionGroups);

    if (releaseNotes !== undefined) {
        toolRunner.arg('--release-notes');

        var releaseNotesText = fs.readFileSync(releaseNotes, 'utf8');
        releaseNotesText = releaseNotesText.substring(0, 200);
        toolRunner.arg(`"${releaseNotesText}"`);
    }

    const noInteractive = tl.getBoolInput('noInteractive', false);

    if (noInteractive) {
        toolRunner.arg('--no-interactive');
    }

    const result = await executeToolRunner(toolRunner);

    if (result !== 0) {
        throw new Error("Firebase distribution failed.");
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
        if (cancellationRequested) {
            tl.setResult(tl.TaskResult.Cancelled, cancelMessage);
            return;
        }

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function uploadItem(uploaderPath: string, symbolPath: string, googleServicesJsonPath: string): Promise<number> {
    // const stringBuilder = new Array<string>();

    // //stringBuilder.push(uploaderPath);
    // stringBuilder.push('-gsp');
    // stringBuilder.push(googleServicesJsonPath);
    // stringBuilder.push('-p');
    // stringBuilder.push('ios');
    // stringBuilder.push(symbolPath);

    // const args = stringBuilder.join(' ');

    // console.log(`Running: ${uploaderPath} ${args}`);
    // const result = await tl.exec(uploaderPath, args);

    let toolRunner = tl.tool(uploaderPath);

    toolRunner.arg('-gsp');
    toolRunner.arg(googleServicesJsonPath);

    toolRunner.arg('-p');
    toolRunner.arg('ios');
    toolRunner.arg(symbolPath);

    const result = await executeToolRunner(toolRunner);
    return result;
}

async function custom() {
    const executable = 'firebase';

    const args = tl.getInput('args', true);

    if (args === undefined) {
        throw new Error('Arguments are required.');
    }

    // const result = tl.execSync(executable, args);
    let toolRunner = tl.tool(executable);

    toolRunner.arg(args);

    const result = await executeToolRunner(toolRunner);

    if (result !== 0) {
        throw new Error("Firebase command failed.");
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

        let toolRunner = tl.tool(executable);

        toolRunner.arg('crashlytics:symbols:upload');
        toolRunner.arg('--app');
        toolRunner.arg(firebaseAppId);
        toolRunner.arg(debugInfoPath);

        const result = await executeToolRunner(toolRunner);

        if (result !== 0) {
            throw new Error("Firebase debug info upload failed.");
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Firebase debug info upload succeeded.');
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function run() {
    let googleAccountCredentialsPath: string | undefined;
    try {
        registerCancellationHandler();

        const type = tl.getInput('type', true);

        if (type === undefined) {
            throw new Error('Task type is required');
        }

        if (type !== 'uploadIOSSymbols' && type !== 'uploadFlutterDebugInfo') {
            const serviceConnection = tl.getInput('firebaseServiceConnection', true);

            if (serviceConnection === undefined || serviceConnection === '') {
                throw new Error('Google service account service connection is required.');
            }

            const jsonContent = readServiceAccountJsonFromServiceConnection(serviceConnection);
            googleAccountCredentialsPath = writeServiceAccountCredentialsFile(jsonContent);

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

    } catch (err: any) {
        if (cancellationRequested) {
            tl.setResult(tl.TaskResult.Cancelled, cancelMessage);
            return;
        }

        tl.setResult(tl.TaskResult.Failed, err.message);
    } finally {
        if (googleAccountCredentialsPath !== undefined && fs.existsSync(googleAccountCredentialsPath)) {
            try {
                fs.unlinkSync(googleAccountCredentialsPath);
            } catch {
                // Ignore cleanup errors so the original failure remains visible.
            }
        }
        tl.setVariable('GOOGLE_APPLICATION_CREDENTIALS', '');
    }
}

async function executeToolRunner(toolRunner: tr.ToolRunner): Promise<number> {
    activeToolRunner = toolRunner;
    const result = await toolRunner.exec();
    activeToolRunner = undefined;

    if (cancellationRequested) {
        throw new Error(cancelMessage);
    }

    return result;
}

function registerCancellationHandler() {
    const cancellationHandler = (signal: string) => {
        if (cancellationRequested) {
            return;
        }

        cancellationRequested = true;
        tl.warning(`Cancellation signal received (${signal}). Stopping active process...`);

        if (activeToolRunner && typeof activeToolRunner.killChildProcess === 'function') {
            activeToolRunner.killChildProcess();
        }
    };

    process.once('SIGINT', () => cancellationHandler('SIGINT'));
    process.once('SIGTERM', () => cancellationHandler('SIGTERM'));
}

run();

