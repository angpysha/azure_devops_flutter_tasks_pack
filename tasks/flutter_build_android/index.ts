import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
 try {
    const projectPath = tl.getPathInput('path', true);
    const useRelease = tl.getBoolInput('isRelease', true);
    const flavor = tl.getInput('buildFlavor', false);
    const bundleType = tl.getInput('bundleType', true);
    const obfuscate = tl.getBoolInput('obfuscate', false);
    const splitDebugInfo = tl.getPathInput('splitDebugInfo', true);
    const useFvm = tl.getBoolInput('useFvm', false);
    const fvmVersion = tl.getInput('fvmVersion', false);

    let flutterExecutable = 'flutter';
    let fvmExecutable = 'fvm';

    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    if (bundleType === undefined) {
        throw new Error('Bundle type is required');
    }

    let toolRunner = tl.tool(useFvm ? fvmExecutable : flutterExecutable);

    if (useFvm && fvmVersion === undefined) {
        throw new Error('FVM version is required');
    }

    let options = <tr.IExecOptions>{
        cwd: projectPath
    };

    if (useFvm && fvmVersion !== undefined) {
      toolRunner.arg('flutter');
      let fvmUseRunner = tl.tool('fvm');
      fvmUseRunner.arg('use');
      fvmUseRunner.arg(fvmVersion);
      await fvmUseRunner.exec(options);
    }

    toolRunner.arg('build');

    if (bundleType === 'apk') {
        toolRunner.arg('apk');
    } else if (bundleType === 'appbundle') {
        toolRunner.arg('appbundle');
    } else {
        throw new Error('Invalid bundle type');
    }

    if (useRelease) {
        toolRunner.arg('--release');
    }

    if (flavor !== undefined && flavor !== '') {
        toolRunner.arg(`--flavor ${flavor}`);
    }

    if (obfuscate) {    
        toolRunner.arg('--obfuscate');
    }

    if (splitDebugInfo !== undefined && obfuscate) {
        toolRunner.arg(`--split-debug-info=${splitDebugInfo}`);
    }

    const result = await toolRunner.exec(options);

    if (result !== 0) {
        throw new Error('Flutter build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Flutter build completed');

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
