import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let activeToolRunner: any;

async function run() {
 try {
    registerCancellationHandler();

    const projectPath = tl.getPathInput('path', true);
    const useRelease = tl.getBoolInput('isRelease', true);
    const flavor = tl.getInput('buildFlavor', false);
    const bundleType = tl.getInput('bundleType', true);
    const nosign = tl.getBoolInput('nosign', false);
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
      activeToolRunner = fvmUseRunner;
      await fvmUseRunner.exec(options);
      activeToolRunner = undefined;
    }

    toolRunner.arg('build');

    if (bundleType === 'ios') {
        toolRunner.arg('ios');
    } else if (bundleType === 'ipa') {
        toolRunner.arg('ipa');
    } else {
        throw new Error('Invalid bundle type');
    }

    if (useRelease) {
        toolRunner.arg('--release');
    }

    if (nosign) {
        toolRunner.arg('--no-codesign');
    }

    if (flavor !== undefined && flavor !== '') {
        toolRunner.arg('--flavor');
        toolRunner.arg(flavor);
    }

    if (obfuscate) {    
        toolRunner.arg('--obfuscate');
    }

    if (splitDebugInfo !== undefined && obfuscate) {
        toolRunner.arg(`--split-debug-info=${splitDebugInfo}`);
    }

    activeToolRunner = toolRunner;
    const result = await toolRunner.exec(options);
    activeToolRunner = undefined;

    if (cancellationRequested) {
        throw new Error(cancelMessage);
    }

    if (result !== 0) {
        throw new Error('Flutter build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Flutter build completed');

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
