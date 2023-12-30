import tl = require('azure-pipelines-task-lib/task');
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

        const stringBuilder = new Array<string>();

        stringBuilder.push('melos');

        stringBuilder.push(command);

        if (commandArgs !== undefined) {
            stringBuilder.push(commandArgs);
        }

        const args = stringBuilder.join(' ');

        console.log(`Running: ${args}`);

        console.log(`##vso[task.prependpath]${folderPath}`);

        let number = await tl.exec(args, null);

        if (number !== 0) {
            throw new Error('Melos failed');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Melos completed');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}