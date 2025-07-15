import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
    try {
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

        const result = await toolRunner.exec(options);

        if (result !== 0) {
            throw new Error('Melos failed');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Melos completed');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();