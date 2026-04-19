import tl = require('azure-pipelines-task-lib/task');
import * as fs from 'fs';
import * as path from 'path';

/** Rejects values that could break pbxproj line shape or inject extra settings. */
function assertSafeToken(label: string, value: string): void {
    if (/[;\r\n]/.test(value)) {
        throw new Error(`${label} must not contain semicolons or newline characters.`);
    }
}

async function run(): Promise<void> {
    try {
        const iosProjectRoot = tl.getPathInput('iosProjectRoot', true);
        const xcodeprojNameRaw = tl.getInput('xcodeprojName', false);
        const marketingVersion = tl.getInput('marketingVersion', true);
        const buildNumber = tl.getInput('buildNumber', true);

        const xcodeprojName = (xcodeprojNameRaw !== undefined && xcodeprojNameRaw.trim() !== '')
            ? xcodeprojNameRaw.trim()
            : 'Runner';

        if (iosProjectRoot === undefined || iosProjectRoot.trim() === '') {
            throw new Error('iOS project root is required.');
        }
        if (marketingVersion === undefined || marketingVersion.trim() === '') {
            throw new Error('Marketing version is required.');
        }
        if (buildNumber === undefined || buildNumber.trim() === '') {
            throw new Error('Build number is required.');
        }

        assertSafeToken('Marketing version', marketingVersion);
        assertSafeToken('Build number', buildNumber);

        const pbxprojPath = path.join(iosProjectRoot, `${xcodeprojName}.xcodeproj`, 'project.pbxproj');

        if (!fs.existsSync(pbxprojPath)) {
            throw new Error(`project.pbxproj not found: ${pbxprojPath}`);
        }

        let content = fs.readFileSync(pbxprojPath, 'utf8');

        const marketingRegex = /MARKETING_VERSION = [0-9.]+;/g;
        const buildRegex = /CURRENT_PROJECT_VERSION = [0-9]+;/g;

        const marketingMatches = content.match(marketingRegex);
        const marketingCount = marketingMatches ? marketingMatches.length : 0;

        content = content.replace(marketingRegex, `MARKETING_VERSION = ${marketingVersion};`);

        const buildMatches = content.match(buildRegex);
        const buildCount = buildMatches ? buildMatches.length : 0;

        content = content.replace(buildRegex, `CURRENT_PROJECT_VERSION = ${buildNumber};`);

        fs.writeFileSync(pbxprojPath, content, 'utf8');

        console.log(
            `Updated project.pbxproj: ${pbxprojPath} (MARKETING_VERSION: ${marketingCount} replacement(s), CURRENT_PROJECT_VERSION: ${buildCount} replacement(s)).`
        );

        if (marketingCount === 0) {
            tl.warning('No MARKETING_VERSION = <version>; lines matched; marketing version section may already be non-numeric or absent.');
        }
        if (buildCount === 0) {
            tl.warning('No CURRENT_PROJECT_VERSION = <number>; lines matched; build number section may already be non-numeric or absent.');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'project.pbxproj updated.');
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        tl.setResult(tl.TaskResult.Failed, message);
    }
}

run();
