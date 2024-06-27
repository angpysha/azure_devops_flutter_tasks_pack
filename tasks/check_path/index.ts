import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
 try {
    const projectPath = tl.getPathInput('path', true);
    
    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    let pathExists = tl.exist(projectPath);
    
    tl.setVariable("pathExists",pathExists.toString());

    tl.setResult(tl.TaskResult.Succeeded, 'Flutter build completed');

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
