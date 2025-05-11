const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy all files to dist directory
const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

// Copy all files except node_modules, .git, etc.
const copyFiles = () => {
    const excludeDirs = ['node_modules', '.git', 'dist', '.github'];
    const files = fs.readdirSync(__dirname);
    
    files.forEach((file) => {
        if (!excludeDirs.includes(file)) {
            const src = path.join(__dirname, file);
            const dest = path.join(distDir, file);
            copyRecursiveSync(src, dest);
        }
    });

    console.log('Build completed! Files copied to /dist directory.');
};

copyFiles();
