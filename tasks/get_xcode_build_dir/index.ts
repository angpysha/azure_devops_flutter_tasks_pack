import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import path = require('path');

async function run() {
 try {
    const projectName = tl.getInput('projectName', true);

    if (projectName === undefined) {
        throw new Error('Project name is required');
    }

    // Отримуємо шлях до DerivedData директорії
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (!homeDir) {
        throw new Error('Cannot determine home directory');
    }

    const derivedDataDir = path.join(homeDir, 'Library', 'Developer', 'Xcode', 'DerivedData');
    
    console.log(`Looking for DerivedData in: ${derivedDataDir}`);

    if (!fs.existsSync(derivedDataDir)) {
        throw new Error(`DerivedData directory does not exist: ${derivedDataDir}`);
    }

    // Знаходимо всі директорії, що починаються з projectName
    const directories = fs.readdirSync(derivedDataDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith(`${projectName}-`))
        .map(dirent => {
            const fullPath = path.join(derivedDataDir, dirent.name);
            const stats = fs.statSync(fullPath);
            return {
                name: dirent.name,
                path: fullPath,
                lastModified: stats.mtime
            };
        });

    if (directories.length === 0) {
        console.log(`##[warning]Could not find DerivedData directory for the ${projectName} project.`);
        tl.setVariable('buildDir', '');
        return;
    }

    // Сортуємо за часом модифікації (найновіша спочатку)
    directories.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    
    const latestDirectory = directories[0];
    const swiftPackagesPath = path.join(latestDirectory.path, 'SourcePackages');
    
    console.log(`Found latest DerivedData directory: ${latestDirectory.name}`);
    console.log(`Swift Packages path: ${swiftPackagesPath}`);
    
    // Встановлюємо змінну pipeline
    console.log(`##vso[task.setvariable variable=SWIFT_PACKAGES_PATH]${swiftPackagesPath}`);
    console.log(`##vso[task.setvariable variable=buildDir;isOutput=true]${latestDirectory.path}`);
    
    // Також встановлюємо як локальну змінну для наступних тасків
    tl.setVariable('buildDir', latestDirectory.path, false, true);
    tl.setVariable('swiftPackagesPath', swiftPackagesPath, false, true);

 } catch (err: any) {
  tl.setResult(tl.TaskResult.Failed, err.message);
 }
}

run();
