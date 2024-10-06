const fs = require('fs');
const path = require('path');

function fetchFolders() {
    const tasksDir = path.join(__dirname, '..', 'tasks');
    console.log('Installing node modules in all task directories...');
    console.log(tasksDir);
    // const items = fs.readdirSync(tasksDir);
    // console.log(items);
    const taskDirs = fs.readdirSync(tasksDir).filter(file => {
        const fullPath = path.join(tasksDir, file);
        let isDir = fs.statSync(fullPath).isDirectory();
        // Check if the folder contains a package.json file as well
        if (!isDir) return false;
        let hasPackageJson = fs.readdirSync(fullPath).includes('package.json');
        return isDir && hasPackageJson;
    });

    return taskDirs;
}

module.exports = fetchFolders;