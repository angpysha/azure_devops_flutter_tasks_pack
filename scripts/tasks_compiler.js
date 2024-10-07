const fetchFolders = require('./folders_fetcher');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const tasksDir = path.join(__dirname, '..', 'tasks');

async function run() {
    let taskDirs = fetchFolders();

    for (const taskDir of taskDirs) {
        const fullPath = path.join(tasksDir, taskDir);
        console.log(`Compiling TypeScript files in ${fullPath}...`);
        try {
            execSync('tsc', { cwd: fullPath, stdio: 'inherit' });
        } catch (err) {
            console.error(`Failed to compile TypeScript files in ${fullPath}.`);
            console.error(err);
        }
    }
}

run();