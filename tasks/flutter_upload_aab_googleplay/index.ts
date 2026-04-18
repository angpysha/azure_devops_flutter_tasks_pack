import * as tl from 'azure-pipelines-task-lib/task';
import { async } from 'q';
import * as fs from 'fs';
import * as path from 'path';

const fastlane = 'fastlane';
type trackValueType = 'production' | 'beta' | 'alpha' | 'internal';
const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let forceExitTimer: NodeJS.Timeout | undefined;
let activeToolRunner: any;


async function run() {
    try {
        registerCancellationHandler();

        // Get keystore file path for signing
        var keystoreFile = tl.getTaskVariable('KEY_FILE_PATH_GOOGLEPLAY');

        const aabFile = tl.getPathInput('aabFile', true);
        const verbose = tl.getBoolInput('verbose', false);
        const track = tl.getInput('track', true);
        const packageId = tl.getInput('packageId', true);

        if (aabFile === undefined) {
            throw new Error('AAB file is required');
        }

        if (!tl.exist(aabFile)) {
            throw new Error(`AAB file not found at ${aabFile}`);
        }

        if (keystoreFile === undefined) {
            throw new Error('Key file is required');
        }

        if (!tl.exist(keystoreFile)) {
            throw new Error(`Key file not found at ${keystoreFile}`);
        }

        if (track === undefined) {
            throw new Error('Track is required');
        }

        if (packageId === undefined) {
            throw new Error('Package Id is required');
        }

        // Try to cast track to trackValueType. If it fails, throw an error
        const trackValue = track as trackValueType;

        // THis task will execute analog to powersehll script
//         # Write your PowerShell commands here.

// uru 322

// fastlane supply --aab "./_ToDoPoints UAT/aab/app-uatstore-release.aab" --json_key "$(google_play_key.secureFilePath)" --package_name "net.petrovskyi.todo_points.uat" --track internal

        

        if (verbose) {
            console.log('Verbose mode enabled');
            console.log(`Start uploading AAB file: ${aabFile}`);
        }

        let toolRunner = tl.tool(fastlane);
        activeToolRunner = toolRunner;

        toolRunner.arg('supply');
        toolRunner.arg('--aab');
        toolRunner.arg(aabFile);
        toolRunner.arg('--json_key');
        toolRunner.arg(keystoreFile);
        toolRunner.arg('--package_name');
        toolRunner.arg(packageId);
        toolRunner.arg('--track');
        toolRunner.arg(trackValue);

        const result = await toolRunner.exec();
        activeToolRunner = undefined;

        if (cancellationRequested) {
            throw new Error(cancelMessage);
        }

        if (result !== 0) {
            throw new Error(`Command failed with exit code ${result}`);
        }

        tl.setResult(tl.TaskResult.Succeeded, 'AAB uploaded successfully');
    } catch (err: any) {
        if (cancellationRequested) {
            tl.setResult(tl.TaskResult.Canceled, cancelMessage);
            return;
        }

        tl.setResult(tl.TaskResult.Failed, err.message);
    } finally {
        clearForceExitTimer();
    }
}

function registerCancellationHandler() {
    const cancellationHandler = (signal: string) => {
        if (cancellationRequested) {
            return;
        }

        cancellationRequested = true;
        tl.warning(`Cancellation signal received (${signal}). Stopping fastlane process...`);

        try {
            if (activeToolRunner && typeof activeToolRunner.killChildProcess === 'function') {
                activeToolRunner.killChildProcess();
            }
        } catch (err) {
            tl.warning(`Unable to stop child process gracefully: ${err}`);
        }

        // Safety net: force process termination if child process does not stop quickly.
        forceExitTimer = setTimeout(() => {
            try {
                tl.setResult(tl.TaskResult.Canceled, cancelMessage);
            } finally {
                process.exit(1);
            }
        }, 5000);
    };

    process.once('SIGINT', () => cancellationHandler('SIGINT'));
    process.once('SIGTERM', () => cancellationHandler('SIGTERM'));
}

function clearForceExitTimer() {
    if (forceExitTimer) {
        clearTimeout(forceExitTimer);
        forceExitTimer = undefined;
    }
}

run();