const fs = require('fs-extra');
const path = require('path');

// Configuration
const BUILD_DIR = 'gh-pages';
const SRC_DIR = 'src';
const ASSETS = [
    'index.html',
    'favicon.ico',
    'manifest.json',
    'robots.txt'
];

// Clean build directory
console.log('Cleaning build directory...');
if (fs.existsSync(BUILD_DIR)) {
    fs.emptyDirSync(BUILD_DIR);
} else {
    fs.mkdirSync(BUILD_DIR);
}

// Create .nojekyll file to prevent Jekyll processing
fs.writeFileSync(path.join(BUILD_DIR, '.nojekyll'), '');

// Copy source files
console.log('Copying source files...');
fs.copySync(SRC_DIR, path.join(BUILD_DIR, SRC_DIR));

// Copy assets
console.log('Copying assets...');
ASSETS.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copySync(file, path.join(BUILD_DIR, file));
    }
});

// Create a simple index.html for GitHub Pages
const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upcarz - Agendamento</title>
    <link href="./dist/output.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div id="app">
        <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-600">Carregando...</p>
            </div>
        </div>
    </div>
    <script type="module" src="./src/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), indexHtml);

console.log('\nBuild completed! Files are ready in the gh-pages/ directory.');
console.log('To deploy to GitHub Pages:');
console.log('1. Create a new repository on GitHub');
console.log('2. Push the contents of the gh-pages/ directory to the gh-pages branch');
console.log('   or use GitHub Actions for automatic deployment');
