
const fs = require('fs/promises');
const path = require('path');

const source = path.resolve(__dirname,'files');
const target = path.resolve(__dirname,'files-copy');

(async function(){
    await copyDir(source, target);
})();

async function copyDir(source, target) {
    try {
        const stat = await fs.stat(source);
        if(!stat.isDirectory()) {
            throw 'Source is not a directory';
        }
    } catch(e) {
        throw e;
    }
    try {
        const stat = await fs.stat(target);
    } catch (e) {
        await fs.mkdir(target);
    }

    const sourceContent = await readDirectory(source);
    const targetContent = await readDirectory(target);

    for (const targetFile of targetContent.files) {
        if(!sourceContent.files.includes(targetFile)) {
            await fs.unlink(path.resolve(target,targetFile));
        }
    }
    for (const sourceFile of sourceContent.files) {
        const sourceFullPath = path.resolve(source,sourceFile);
        const targetFullPath =  path.resolve(target,sourceFile);
        await fs.copyFile(
            sourceFullPath,
            targetFullPath
        );
    }

    for (const targetFile of targetContent.dirs) {
        if(!sourceContent.dirs.includes(targetFile)) {
            await fs.rmdir(path.resolve(target,targetFile),{
                recursive: true
            });
        }
    }

    for (const sourceFile of sourceContent.dirs) {
        const sourceFullPath = path.resolve(source,sourceFile);
        const targetFullPath =  path.resolve(target,sourceFile);
        await copyDir(sourceFullPath,targetFullPath);
    }

    console.log(JSON.stringify([sourceContent,targetContent],null,4));
}

async function readDirectory(source) {
    const sourceFilesWithTypes = await fs.readdir(source,{
        withFileTypes: true
    });
    const sourceDirs = sourceFilesWithTypes.filter((file)=>{
        return file.isDirectory();
    }).map((file)=> file.name);
    const sourceFiles = sourceFilesWithTypes.filter((file)=>{
        return file.isFile();
    }).map((file)=> file.name);

    return {
        dirs: sourceDirs,
        files: sourceFiles
    };
}
