const fs = require('fs/promises');
const path = require('path');
const { EOL } = require('os');

const stylesDir = path.resolve(__dirname,'styles');
const bundlePath = path.resolve(__dirname,'bundle.css');

(async () => {
    await createStylesBundle(stylesDir, bundlePath);
})();


async function createStylesBundle(stylesDir, bundlePath) {
    let styles;
    try {
        styles = await fs.readdir(stylesDir,{
            withFileTypes: true
        });

        styles = styles.filter((file)=>{
            return file.isFile() && path.extname(file.name)=='.css';
        }).map((file)=> file.name);
        styles.sort();
    } catch (e){
        throw e;
    }

    const bundleFileHandle = await fs.open(bundlePath,'w');

    for (const style of styles) {
        const stylePath = path.resolve(stylesDir,style);

        const css = await fs.readFile(stylePath);
        await bundleFileHandle.write(css);
        await bundleFileHandle.write(EOL);
    }

    await bundleFileHandle.close();
}
