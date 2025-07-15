import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

/**
 * Archive the build
 */
async function archive() {
    const signOnArchive = tl.getBoolInput('signOnArchive', true);

    const projectPath = tl.getPathInput('path', true);
    const archivePath = tl.getPathInput('archivePath', true);

    const buildScheme = tl.getInput('scheme', true);
    const buildConfiguration = tl.getInput('configuration', true);
    const xcodeWorkspacePath = tl.getPathInput('workspace', true);
    const signIdentity = tl.getInput('signIdentity', false);
    const provisioningProfileUuid = tl.getInput('provisioningProfile', false);

    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    if (archivePath === undefined) {
        throw new Error('Archive path is required');
    }

    if (buildScheme === undefined) {
        throw new Error('Scheme is required');
    }

    if (buildConfiguration === undefined) {
        throw new Error('Configuration is required');
    }

    if (xcodeWorkspacePath === undefined) {
        throw new Error('Workspace is required');
    }

    if (signOnArchive === undefined) {
        throw new Error('Sign on archive is required');
    }

    if (signIdentity === undefined && signOnArchive) {
        throw new Error('Sign identity is required');
    }

    if (provisioningProfileUuid === undefined && signOnArchive) {
        throw new Error('Provisioning profile is required');
    }

    let toolRunner = tl.tool('xcodebuild');
    toolRunner.arg('archive');

    toolRunner.arg('-scheme');
    toolRunner.arg(buildScheme);

    toolRunner.arg('-configuration');
    toolRunner.arg(buildConfiguration);

    toolRunner.arg('-workspace');
    toolRunner.arg(xcodeWorkspacePath);

    toolRunner.arg('-archivePath');
    toolRunner.arg(archivePath);

    if (!signOnArchive) {
        // CODE_SIGN_IDENTITY="" \
        // CODE_SIGNING_REQUIRED=NO \
        // CODE_SIGNING_ALLOWED=NO
        toolRunner.arg('CODE_SIGN_IDENTITY=""');
        toolRunner.arg('CODE_SIGNING_REQUIRED=NO');
        toolRunner.arg('CODE_SIGNING_ALLOWED=NO');
    } else {
        toolRunner.arg('CODE_SIGN_STYLE=Manual');
        toolRunner.arg(`CODE_SIGN_IDENTITY=${signIdentity}`);
        toolRunner.arg(`PROVISIONING_PROFILE=${provisioningProfileUuid}`);
    }

    const options = <tr.IExecOptions>{ 
        cwd: projectPath
    };
    const result = await toolRunner.exec(options);

    if (result !== 0) {
        throw new Error('Xcode build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Xcode archive completed');
}

async function exportArchive() {

    const projectPath = tl.getPathInput('path', true);
    const archivePath = tl.getPathInput('archivePath', true);
    const exportOptionsPath = tl.getPathInput('exportOptionsPath', true);
    const exportPath = tl.getPathInput('exportPath', true);

    if (projectPath === undefined) {
        throw new Error('Project path is required');
    }

    if (archivePath === undefined) {
        throw new Error('Archive path is required');
    }

    if (exportOptionsPath === undefined) {
        throw new Error('Export options path is required');
    }

    if (exportPath === undefined) {
        throw new Error('Export path is required');
    }

    let toolRunner = tl.tool('xcodebuild');

    toolRunner.arg('exportArchive');

    toolRunner.arg('-archivePath');
    toolRunner.arg(archivePath);

    toolRunner.arg('-exportOptionsPlist');
    toolRunner.arg(exportOptionsPath);

    toolRunner.arg('-exportPath');
    toolRunner.arg(exportPath);

    const options = <tr.IExecOptions>{ 
        cwd: projectPath
    };

    const result = await toolRunner.exec(options);

    if (result !== 0) {
        throw new Error('Xcode export failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Xcode export completed');
}

async function run() {
    try {
      const type = tl.getInput('taskType', true);

      if (type === undefined) {
          throw new Error('Task type is required');
      }

      if (type === 'archive') {
        await archive();
      } else if (type === 'export') {
        await exportArchive();
      }

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
