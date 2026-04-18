import tl = require('azure-pipelines-task-lib/task');
import { async } from 'q';

const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let activeToolRunner: any;

async function run() {
    try {
        registerCancellationHandler();

        // Get keystore file path for signing
        var keystoreFile = tl.getTaskVariable('KEYSTORE_FILE_PATH_AAB');

        const aabPath = tl.getPathInput('aabFile', true);
        const keystorePassword = tl.getInput('keystorePassword', true);
        const keyAlias = tl.getInput('keyAlias', true);
        const verbose = tl.getBoolInput('verbose', false);

        if (aabPath === undefined) {
            throw new Error('AAB file is required');
        }

        if (keystorePassword === undefined) {
            throw new Error('Keystore password is required');
        }

        if (keyAlias === undefined) {
            throw new Error('Key alias is required');
        }

        //Using for testing
 //       keystoreFile = process.env.KEYSTORE_FILE_PATH_AAB;

        if (keystoreFile === undefined) {
            throw new Error('Keystore file is required');
        }

        if (!tl.exist(keystoreFile)) {
            throw new Error(`Keystore file not found at ${keystoreFile}`);
        }
        let toolRunner = tl.tool('jarsigner');

        if (verbose) {
            toolRunner.arg('-verbose');
        }
        toolRunner.arg('-sigalg');
        toolRunner.arg('SHA256withRSA');
        toolRunner.arg('-digestalg');
        toolRunner.arg('SHA-256');
        toolRunner.arg('-storepass');
        toolRunner.arg(keystorePassword);
        toolRunner.arg('-keystore');
        toolRunner.arg(keystoreFile);
        toolRunner.arg(aabPath);
        toolRunner.arg(keyAlias);

        activeToolRunner = toolRunner;
        const result = await toolRunner.exec();
        activeToolRunner = undefined;

        if (cancellationRequested) {
            throw new Error(cancelMessage);
        }

        if (result !== 0) {
            throw new Error('Failed to sign AAB');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'AAB signed successfully');

    } catch (err: any) {
        if (cancellationRequested) {
            tl.setResult(tl.TaskResult.Canceled, cancelMessage);
            return;
        }

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
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