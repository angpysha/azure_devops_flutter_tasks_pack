import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

/**
 * Archive the build
 */
async function archive() {
    const projectPath = tl.getPathInput('path', true);
    const archivePath = tl.getPathInput('archivePath', true);

    const buildScheme = tl.getInput('scheme', true);
    const buildConfiguration = tl.getInput('configuration', true);
    const xcodeWorkspacePath = tl.getPathInput('workspace', true);
    const signIdentity = tl.getInput('signIdentity', true);
    const provisioningProfileUuid = tl.getInput('provisioningProfile', true);

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

    if (signIdentity === undefined) {
        throw new Error('Sign identity is required');
    }

    if (provisioningProfileUuid === undefined) {
        throw new Error('Provisioning profile is required');
    }

    const stringBuilder = new Array<string>();

    stringBuilder.push('archive');

    stringBuilder.push('-scheme');
    stringBuilder.push(buildScheme);

    stringBuilder.push('-configuration');
    stringBuilder.push(buildConfiguration);

    stringBuilder.push('-workspace');
    stringBuilder.push(xcodeWorkspacePath);

    stringBuilder.push('-archivePath');
    stringBuilder.push(archivePath);

    stringBuilder.push('CODE_SIGN_STYLE=Manual');

    stringBuilder.push(`CODE_SIGN_IDENTITY=${signIdentity}`);
    stringBuilder.push(`PROVISIONING_PROFILE=${provisioningProfileUuid}`);

    const command = stringBuilder.join(' ');

    console.log(`Running:xcodebuild ${command}`);

    const options = <tr.IExecOptions>{ 
        cwd: projectPath
    };

    const result = await tl.exec('xcodebuild', command, options);

    if (result !== 0) {
        throw new Error('Xcode build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Xcode build completed');
}

async function exportArchive() {
    const projectPath = tl.getPathInput('path', true);
    const archivePath = tl.getPathInput('archivePath', true);

    const exportOptionsPath = tl.getTaskVariable('EXPORT_OPTIONS_PLIST_PATH');
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

    const stringBuilder = new Array<string>();

    stringBuilder.push('-exportArchive');

    stringBuilder.push('-archivePath');
    stringBuilder.push(archivePath);

    stringBuilder.push('-exportOptionsPlist');
    stringBuilder.push(exportOptionsPath);

    stringBuilder.push('-exportPath');
    stringBuilder.push(exportPath);

    const command = stringBuilder.join(' ');

    console.log(`Running:xcodebuild ${command}`);

    let options = <tr.IExecOptions>{
        cwd: projectPath
    };

    const result = await tl.exec('xcodebuild', command, options);

    if (result !== 0) {
        throw new Error('Xcode build failed');
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Xcode build completed');

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
