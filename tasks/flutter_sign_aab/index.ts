import tl = require('azure-pipelines-task-lib/task');
import { async } from 'q';

async function run() {
    try {
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



        const signAlgorythmString = '-sigalg SHA256withRSA -digestalg SHA-256';

        const stringBuilder = new Array<string>();

       // stringBuilder.push('jarsigner.exe');

        if (verbose) {
            stringBuilder.push('-verbose');
        }

        stringBuilder.push(signAlgorythmString);

        stringBuilder.push('-storepass');
        stringBuilder.push(keystorePassword);

        stringBuilder.push('-keystore');
        stringBuilder.push(keystoreFile);

        stringBuilder.push(aabPath);

        stringBuilder.push(keyAlias);

        const command = stringBuilder.join(' ');

        const result = await tl.exec('jarsigner', command);

        if (result !== 0) {
            throw new Error('Failed to sign AAB');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'AAB signed successfully');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();