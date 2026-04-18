import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

const cancelMessage = 'Task was canceled by user request.';
let cancellationRequested = false;
let activeToolRunner: any;

async function run() {
 try {
    registerCancellationHandler();

    const ipaPath = tl.getPathInput('path', true);
    const provisioningProfile = tl.getTaskVariable('PROVISIONING_PROFILE');
    const signingIdentity = tl.getInput('signIdentity', true);

    if (ipaPath === undefined) {
        throw new Error('IPA path is required');
    }

    if (provisioningProfile === undefined) {
        throw new Error('Provisioning profile is required');
    }

    if (signingIdentity === undefined) {
        throw new Error('Sign identity is required');
    }

    if (!tl.exist(ipaPath)) {
        throw new Error('IPA file does not exist');
    }

    if (!tl.exist(provisioningProfile)) {
        throw new Error('Provisioning profile does not exist');
    }

    let toolRunner = tl.tool('fastlane');
    toolRunner.arg('run');
    toolRunner.arg('resign');
    toolRunner.arg(`ipa:${ipaPath}`);
    toolRunner.arg(`signing_identity:${signingIdentity}`);
    toolRunner.arg(`provisioning_profile:${provisioningProfile}`);

    activeToolRunner = toolRunner;
    const result = await toolRunner.exec();
    activeToolRunner = undefined;

    if (cancellationRequested) {
        throw new Error(cancelMessage);
    }

    if (result !== 0) {
        throw new Error('Fastlane failed with exit code: ' + result);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Resigning completed successfully');

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
