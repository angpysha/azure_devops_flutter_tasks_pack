import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let activeToolRunner: any;

async function run() {
    try {
        registerCancellationHandler();

        const folderPath = tl.getPathInput('path', true);
        const command = tl.getInput('command', true);
        const commandArgs = tl.getInput('commandArgs', false);

        if (folderPath === undefined) {
            throw new Error('Folder path is required');
        }

        if (command === undefined) {
            throw new Error('Command is required');
        }

        let toolRunner = tl.tool('melos');

        toolRunner.arg(command);

        if (commandArgs !== undefined) {
            toolRunner.arg(commandArgs);
        }

        let options = <tr.IExecOptions>{
            cwd: folderPath
        };

        activeToolRunner = toolRunner;
        const result = await toolRunner.exec(options);
        activeToolRunner = undefined;

        if (cancellationRequested) {
            throw new Error(cancelMessage);
        }

        if (result !== 0) {
            throw new Error('Melos failed');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Melos completed');

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