const fetchFolders = require('./folders_fetcher');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const tasksDir = path.join(__dirname, '..', 'tasks');
// Get folders in the tasks directory



// Install node modules in each task directory

async function run() {
    // console.log('Installing node modules in all task directories...');
    // console.log(tasksDir);
    // // const items = fs.readdirSync(tasksDir);
    // // console.log(items);
    // const taskDirs = fs.readdirSync(tasksDir).filter(file => {
    //     const fullPath = path.join(tasksDir, file);
    //     let isDir = fs.statSync(fullPath).isDirectory();
    //     // Check if the folder contains a package.json file as well
    //     if (!isDir) return false;
    //     let hasPackageJson = fs.readdirSync(fullPath).includes('package.json');
    //     return isDir && hasPackageJson;
    // });
    let taskDirs = fetchFolders();
    // console.log(taskDirs);

    for (const taskDir of taskDirs) {
        const fullPath = path.join(tasksDir, taskDir);
        console.log(`Installing node modules in ${fullPath}...`);
        try {
          //  execSync('yarn install', { cwd: fullPath, stdio: 'inherit' });
        } catch (err) {
            console.error(`Failed to install node modules in ${fullPath}.`);
            console.error(err);
        }
    }
}

// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// const tasksDir = path.join(__dirname, 'tasks');

// // Function to compile TypeScript files in a given directory
// function compileTask(taskDir) {
//   const tsConfigPath = path.join(taskDir, 'tsconfig.json');
//   if (fs.existsSync(tsConfigPath)) {
//     console.log(`Compiling TypeScript files in ${taskDir}...`);
//     execSync('tsc', { cwd: taskDir, stdio: 'inherit' });
//   } else {
//     console.warn(`No tsconfig.json found in ${taskDir}, skipping...`);
//   }
// }

// // Get all task directories
// const taskDirs = fs.readdirSync(tasksDir).filter(file => {
//   const fullPath = path.join(tasksDir, file);
//   return fs.statSync(fullPath).isDirectory();
// });

// // Compile TypeScript files in each task directory
// taskDirs.forEach(taskDir => {
//   compileTask(path.join(tasksDir, taskDir));
// });

// console.log('TypeScript compilation completed for all tasks.');

run();