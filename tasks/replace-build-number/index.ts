import tl = require('azure-pipelines-task-lib/task');
import { async } from 'q';
import fs from 'fs'
import YAML from 'yaml'
import { version } from 'os';

async function run() {  
    try {
        const buildNumber = tl.getInput('buildNumber', true);
        const versionString = tl.getInput('versionString', true);
        const pubspecPath = tl.getPathInput('pubspecPath', true);
        const replaceIncriment = tl.getInput('incrimentBuildNumber', false);

        if (buildNumber === undefined) {
            throw new Error('Build number is required');
        }
        
        if (versionString === undefined) {
            throw new Error('Version string is required');
        }

        if (pubspecPath === undefined) {
            throw new Error('Pubspec path is required');
        }
        
        var incriment: number = 0;
        if (replaceIncriment !== undefined) {
            incriment = parseInt(replaceIncriment);
        }

        const stringBuilder = new Array<string>();

        stringBuilder.push(versionString);
        stringBuilder.push('+');
        
        if (incriment !== 0) {
            const buildNumberInt = parseInt(buildNumber);
            const newBuildNumber = buildNumberInt + incriment;
            stringBuilder.push(newBuildNumber.toString());
        } else {
            stringBuilder.push(buildNumber);
        }

        const newVersionString = stringBuilder.join('');

        console.log(`Replacing version string with ${newVersionString}`);

        if (!fs.existsSync(pubspecPath)) {
            throw new Error(`Pubspec file not found at ${pubspecPath}`);
        }

        const pubspecFile = fs.readFileSync(pubspecPath, 'utf8');

        const pubspec = YAML.parse(pubspecFile);

        pubspec["version"] = newVersionString;

        const newYaml = YAML.stringify(pubspec);

        console.log(`Old yaml: ${pubspecFile}`);

        console.log(`New yaml: ${newYaml}`);

        fs.writeFileSync(pubspecPath, newYaml);

        tl.setResult(tl.TaskResult.Succeeded, `Version string replaced with ${newVersionString}`);

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();