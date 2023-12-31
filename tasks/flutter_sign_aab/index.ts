import tl = require('azure-pipelines-task-lib/task');
import { async } from 'q';

async function run() {  
    try {
        const keyStorePath = tl.getSecureFileName('keyStorePath');
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();