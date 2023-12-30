import tl = require('azure-pipelines-task-lib/task');
import { async } from 'q';

async function run() {  
    try {
        const useVerbose = tl.getBoolInput('verbose', false);

        const stringBuilder = new Array<string>();

        stringBuilder.push('doctor');

        if (useVerbose) {
            stringBuilder.push('-v');
        }

        const args = stringBuilder.join(' ');

        let number = await tl.exec('flutter', args);

        if (number !== 0) {
            throw new Error('Flutter doctor failed');
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Flutter doctor completed');
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();