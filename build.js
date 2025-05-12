const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Clean dist directory
fs.emptyDirSync('dist');

// Copy all files to dist
execSync('xcopy /E /I /Y "src" "dist\\src"');

// Copy index.html
try {
    fs.copyFileSync('index.html', 'dist/index.html');
    console.log('Copied index.html to dist/');
} catch (err) {
    console.error('Error copying index.html:', err);
}

// Copy package.json
try {
    const pkg = require('./package.json');
    // Remove devDependencies for production
    delete pkg.devDependencies;
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
    console.log('Created package.json in dist/');
} catch (err) {
    console.error('Error creating package.json:', err);
}
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
