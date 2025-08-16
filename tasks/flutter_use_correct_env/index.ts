import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import { async } from 'q';

const fs = require('fs');
const yaml = require('yaml');

async function run() {
 try {
    const envFolderPath = tl.getPathInput('envFolderPath', true);
    const envName = tl.getInput('envName', true);
    const pubspecPath = tl.getPathInput('pubspecPath', true);

    if (envFolderPath === undefined) {
        throw new Error('Env folder path is required');
    }

    if (envName === undefined) {
        throw new Error('Env name is required');
    }
    
    if (pubspecPath === undefined) {
        throw new Error('Pubspec path is required');
    }

    const envFiles = fs.readdirSync(envFolderPath).filter((file: string) => file.startsWith('.env'));

    if (envFiles.length === 0) {
        throw new Error('No env files found in the env folder');
    }

    // check if file for env exists. Should be .evv.$envName
    const envFile = envFiles.find((file: string) => file.startsWith(`.env.${envName}`));

    if (envFile === undefined) {
        throw new Error(`Env file for ${envName} not found in the env folder`);
    }

    console.log(`Env file for ${envName} found in the env folder ${envFile}`);

    // read pubspec.yaml file
    const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
    const pubspec = yaml.parse(pubspecContent);
    const assets: string[] = pubspec["flutter"]["assets"];
    // console.log(`flutter assets: ${assets}`);
    const anotherAssets = assets.filter((asset: string) => !asset.includes(`env`));
    const envAsset = assets.find((asset: string) => asset.includes(`${envName}`));
    // const envAssestsToNotInclude = assets.filter((asset: string) => asset.startsWith(`.env.`) && !asset.startsWith(`.env.${envName}`));
    console.log(`envAssestsToNotInclude: ${anotherAssets}`);
    console.log(`envAsset: ${envAsset}`);

    anotherAssets.push(envAsset!);
    pubspec["flutter"]["assets"] = anotherAssets;
    fs.writeFileSync(pubspecPath, yaml.stringify(pubspec));

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
