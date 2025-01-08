const { exec } = require('child_process');
const os = require('os');
const path = require('path');

function convertToMarkdown(filePath, callback) {
    const pythonScript = path.join(__dirname, 'markdown_converter.py');
    const venvPath = path.join(__dirname, 'venv');
    const isWindows = os.platform() === 'win32';
    
    const pythonExecutable = isWindows
        ? path.join(venvPath, 'Scripts', 'python.exe')
        : path.join(venvPath, 'bin', 'python');

    exec(`"${pythonExecutable}" "${pythonScript}" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback(error, null);
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return callback(stderr, null);
        }
        callback(null, stdout);
    });
}

module.exports = { convertToMarkdown };