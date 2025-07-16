import * as tl from 'azure-pipelines-task-lib/task';
import { async } from 'q';
import * as fs from 'fs';
import * as path from 'path';

const fastlane = 'fastlane';
type trackValueType = 'production' | 'beta' | 'alpha' | 'internal';


async function run() {
    try {
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

        if (result !== 0) {
            throw new Error(`Command failed with exit code ${result}`);
        }

        tl.setResult(tl.TaskResult.Succeeded, 'AAB uploaded successfully');
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();