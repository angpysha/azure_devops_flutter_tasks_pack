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

    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    if (flavor !== undefined && flavor !== '') {
        tl.setVariable('FLAVOR', flavor);
        tl.setVariable('BUILD_CONFIGURATION', useRelease ? 'Release' : 'Debug')
    }

    let options = <tr.IExecOptions>{
        cwd: projectPath
    };

    let toolRunner = tl.tool('flutter');
    toolRunner.arg('build');

    if (useRelease) {
        toolRunner.arg('--release');
    }

    if (flavor !== undefined && flavor !== '') {
        toolRunner.arg('--flavor');
        toolRunner.arg(flavor);
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
