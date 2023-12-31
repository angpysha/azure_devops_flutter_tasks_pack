import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
 try {
    const projectPath = tl.getPathInput('path', true);
    const useRelease = tl.getBoolInput('isRelease', true);
    const flavor = tl.getInput('buildFlavor', false);
    const bundleType = tl.getInput('bundleType', true);
    const nosign = tl.getBoolInput('nosign', false);

    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    if (bundleType === undefined) {
        throw new Error('Bundle type is required');
    }

    const stringBuilder = new Array<string>();

    stringBuilder.push('build');

    stringBuilder.push(bundleType);

    if (useRelease) {
        stringBuilder.push('--release');
    }

    if (nosign) {
        stringBuilder.push('--no-codesign');
    }

    if (flavor !== undefined && flavor !== '') {
        stringBuilder.push(`--flavor ${flavor}`);
    }

    const command = stringBuilder.join(' ');

    console.log(`Running: ${command}`);

    let options = <tr.IExecOptions>{
        cwd: projectPath
    };

    // console.log(`Running: flutter ${command}`);
    const result = await tl.exec('flutter', command, options);

    if (result !== 0) {
        throw new Error('Flutter build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Flutter build completed');

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
