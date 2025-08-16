import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
 try {
    const name = tl.getInput('name', true);
    const value = tl.getInput('value', true);

    if (name === undefined || value === undefined) {
        throw new Error('Name and value are required');
    }

    // console.log(`##vso[task.setvariable variable=SWIFT_PACKAGES_PATH]${swiftPackagesPath}`);

    tl.setVariable(name, value);

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
