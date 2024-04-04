import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

async function run() {
 try {
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

    const stringBuilder = new Array<string>();

    stringBuilder.push('run resign');

    stringBuilder.push('ipa:"' + ipaPath + '"');
    stringBuilder.push('signing_identity:"' + signingIdentity + '"');
    stringBuilder.push('provisioning_profile:"' + provisioningProfile + '"');

    const command = stringBuilder.join(' ');

    const result = await tl.exec('fastlane', command);

    if (result !== 0) {
        throw new Error('Fastlane failed with exit code: ' + result);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Resigning completed successfully');

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
