const { exec, spawn } = require('child_process');
const fs = require('fs');
const fsp = require('fs').promises;
const os = require('os');
const path = require('path');

async function executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, [], {
            ...options,
            shell: true,
            stdio: options.silent ? 'ignore' : 'inherit'
        });
        
        proc.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Error in command: ${command} (code ${code})`));
            }
        });
    });
}

async function setup() {
    try {
        const venvPath = path.join(__dirname, 'venv');
        const isWindows = os.platform() === 'win32';
        
        // Create uploads directory silently
        try {
            await fsp.access(path.join(__dirname, 'uploads'));
        } catch {
            await fsp.mkdir(path.join(__dirname, 'uploads'));
        }

        // Check/create virtual environment
        try {
            await fsp.access(venvPath);
        } catch {
            try {
                await executeCommand('python3 -m ensurepip --upgrade', { silent: true });
                await executeCommand('python3 -m venv venv', { silent: true });
            } catch (error) {
                try {
                    await executeCommand('python -m ensurepip --upgrade', { silent: true });
                    await executeCommand('python -m venv venv', { silent: true });
                } catch (error) {
                    throw new Error('Could not create Python virtual environment');
                }
            }
        }

        // Upgrade pip and install dependencies silently
        const pythonBin = isWindows ? 'Scripts\\python.exe' : 'bin/python3';
        await executeCommand(`"${path.join(venvPath, pythonBin)}" -m pip install --upgrade pip --quiet`, { silent: true });
        await executeCommand(`"${path.join(venvPath, pythonBin)}" -m pip install -r requirements.txt --quiet`, { silent: true });
        await executeCommand('npm install --silent', { silent: true });

    } catch (error) {
        console.error('\n❌ Error during setup:', error.message);
        process.exit(1);
    }
}

const venvPath = path.join(__dirname, 'venv');
const requirementsPath = path.join(__dirname, 'requirements.txt');

if (!fs.existsSync(venvPath)) {
    console.log('Creating Python virtual environment...');
    exec(`python -m venv ${venvPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating virtual environment: ${error.message}`);
            process.exit(1);
        }
        console.log(stdout);
        console.log('Installing Python dependencies...');
        const pip = process.platform === 'win32' ? path.join(venvPath, 'Scripts', 'pip.exe') : path.join(venvPath, 'bin', 'pip');
        exec(`"${pip}" install -r "${requirementsPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing dependencies: ${error.message}`);
                process.exit(1);
            }
            console.log(stdout);
            console.log('Python environment set up successfully.');
        });
    });
} else {
    console.log('The virtual environment already exists. Skipping setup.');
}

module.exports = setup;

if (require.main === module) {
    setup();
}