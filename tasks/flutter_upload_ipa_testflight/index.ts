import * as tl from 'azure-pipelines-task-lib/task';
import { async } from 'q';
import './models/app_store_fastlane';
import * as fs from 'fs';
import * as path from 'path';

const fastlane = 'fastlane';
const generalKeyFilePath = path.join(__dirname, 'key.json');

async function run() {
    try {
        // Get keystore file path for signing
        var keystoreFile = tl.getTaskVariable('KEY_FILE_PATH_TESTFLIGHT');

        const ipaPath = tl.getPathInput('ipaFile', true);
        const keyId = tl.getInput('keyId', true);
        const issuerId = tl.getInput('issuerId', true);
        const teamId = tl.getInput('teamId', false);
        const verbose = tl.getBoolInput('verbose', false);
        const duration = tl.getInput('duration', false);
        // THis task will execute analog to powersehll script

        // # Write your PowerShell commands here.
        // $key_path = "$(appleAuthKey.secureFilePath)"
        // echo "path: $key_path"

        // #fastlane run app_store_connect_api_key key_id:$(APPLE_STORE_KEY_ID) issuer_id:$(APPLE_STORE_ISSUER_ID) key_filepath:$key_path duration:1200 #in_house:false

        // $key  = Get-Content $key_path -Raw

        // $jsonObject = @{
        // key_id = "$(APPLE_STORE_KEY_ID)"
        // issuer_id = "$(APPLE_STORE_ISSUER_ID)"
        // key = "$key"
        // duration = 500
        // in_house = $false
        // }
        // $json = ConvertTo-Json $jsonObject -Depth 5
        // cd "_ToDoPoints UAT/ipa-store"
        // fastlane pilot upload --team_id "RFVKD37M39" --api_key $json

        if (verbose) {
            console.log('Verbose mode enabled');
            console.log(`Start uploading ipa file: ${ipaPath}`);
        }

        if (ipaPath === undefined) {
            throw new Error('IPA file is required');
        }

        if (!tl.exist(ipaPath)) {
            throw new Error(`IPA file not found at ${ipaPath}`);
        }

        if (keystoreFile === undefined) {
            throw new Error('Key file is required');
        }

        if (!tl.exist(keystoreFile)) {
            throw new Error(`Key file not found at ${keystoreFile}`);
        }

        if (keyId === undefined || keyId === '') {
            throw new Error('Key Id is required');
        }

        if (issuerId === undefined || issuerId === '') {
            throw new Error('Issuer Id is required');
        }

        var durationInt = 500;

        if (duration !== undefined && duration !== '') {
            durationInt = parseInt(duration);
        }

        // Get file content uisng default endoign and typescript way to read file
        var keyFileContent = await fs.readFileSync(keystoreFile, 'utf8');

        if (keyFileContent === undefined || keyFileContent === '') {
            throw new Error('Key file content is empty');
        }

        // FIrst things first need to authorise fastlane run app_store_connect_api_key key_id:{keyid} issuer_id:{issuer_id} duration:{duration} key_filepath:{keyFilePath} in_house:false

        // const authoriseResult = await authoriseFastlane(keyId, issuerId, keystoreFile, durationInt, false);

        // if (!authoriseResult) {
        //     throw new Error('Failed to authorise fastlane');
        // }

        // Upload IPA file. In this case we ca use just fastlane pilot upload --ipa path_to_ipa_file. Also team id is optional.
        // const uploadResult = await uploadIpaFile(ipaPath, teamId);

        // if (!uploadResult) {
        //     throw new Error('Failed to upload IPA file');
        // }

        var item: AppStoreFastlaneInfo = {
            key_id: keyId,
            issuer_id: issuerId,
            // Content of the key file
            key: keyFileContent,
            duration: durationInt,
            in_house: false
        }

        let itemJson = JSON.stringify(item);
        // Create JSON file with the content of the key file
        fs.writeFileSync(generalKeyFilePath, itemJson);

        // // Create commnad for fastlane pilot upload

        // const executableName = 'fastlane';
        const stringBuilder = new Array<string>();

        stringBuilder.push('pilot');
        stringBuilder.push('upload');

        if (teamId !== undefined && teamId !== '') {
            stringBuilder.push('--team_id');
            stringBuilder.push(teamId);
        }

        stringBuilder.push('--api_key_path');
        stringBuilder.push(generalKeyFilePath);
        stringBuilder.push('--ipa');
        stringBuilder.push(ipaPath);

        const command = stringBuilder.join(' ');

        console.log(`Executing command: ${command}`);

        // // Execute command
        const result = await tl.exec(fastlane, command);

        if (result !== 0) {
            throw new Error(`Command failed with exit code ${result}`);
        }


        tl.setResult(tl.TaskResult.Succeeded, 'IPA uploaded successfully');

    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    } finally {
        // Remove general key file
        await removeGeneralKeyFile(generalKeyFilePath);
    }
}

async function removeGeneralKeyFile(generalKeyFilePath: string) {
    if (generalKeyFilePath !== undefined && tl.exist(generalKeyFilePath)) {
        fs.unlinkSync(generalKeyFilePath);
    }
}

async function authoriseFastlane(
    keyId: string,
    issuerId: string,
    keyFilePath: string,
    duration: number,
    inHouse: boolean
): Promise<boolean> {
    try {
        if (keyId === undefined || keyId === '') {
            throw new Error('Key Id is required');
        }

        if (issuerId === undefined || issuerId === '') {
            throw new Error('Issuer Id is required');
        }

        if (keyFilePath === undefined || keyFilePath === '') {
            throw new Error('Key file path is required');
        }

        if (!tl.exist(keyFilePath)) {
            throw new Error(`Key file not found at ${keyFilePath}`);
        }

        const stringBuilder = new Array<string>();

        stringBuilder.push('run');
        stringBuilder.push('app_store_connect_api_key');

        stringBuilder.push(`key_id:${keyId}`);
        stringBuilder.push(`issuer_id:${issuerId}`);
        stringBuilder.push(`key_filepath:${keyFilePath}`);
        stringBuilder.push(`duration:${duration}`);
        stringBuilder.push(`in_house:${inHouse}`);

        const command = stringBuilder.join(' ');

        console.log(`Executing command: ${command}`);

        const result = await tl.exec(fastlane, command);

        if (result !== 0) {
            throw new Error(`Command failed with exit code ${result}`);
        }

        return true;
    } catch (err: any) {
        return false;
    } finally {}
}

/// Upload IPA file to TestFlight. The second parameter is optional and is used for team id
async function uploadIpaFile(ipaPath: string, team_id: string | undefined): Promise<boolean> {
    try {

        if (ipaPath === undefined) {
            throw new Error('IPA file is required');
        }

        if (!tl.exist(ipaPath)) {
            throw new Error(`IPA file not found at ${ipaPath}`);
        }

        const stringBuilder = new Array<string>();

        stringBuilder.push('pilot');
        stringBuilder.push('upload');

        if (team_id !== undefined && team_id !== '') {
            stringBuilder.push('--team_id');
            stringBuilder.push(team_id);
        }

        stringBuilder.push('--ipa');
        stringBuilder.push(ipaPath);

        const command = stringBuilder.join(' ');

        console.log(`Executing command: ${command}`);

        const result = await tl.exec(fastlane, command);

        if (result !== 0) {
            throw new Error(`Command failed with exit code ${result}`);
        }

        return true;
    } catch (err: any) {
        return false;
    }
}

run();