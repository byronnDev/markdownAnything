const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
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
                reject(new Error(`Error en el comando: ${command} (código ${code})`));
            }
        });
    });
}

async function setup() {
    try {
        const venvPath = path.join(__dirname, 'venv');
        const isWindows = os.platform() === 'win32';
        
        // Crear directorio uploads silenciosamente
        try {
            await fs.access(path.join(__dirname, 'uploads'));
        } catch {
            await fs.mkdir(path.join(__dirname, 'uploads'));
        }

        // Verificar/crear entorno virtual
        try {
            await fs.access(venvPath);
        } catch {
            try {
                await executeCommand('python3 -m ensurepip --upgrade', { silent: true });
                await executeCommand('python3 -m venv venv', { silent: true });
            } catch (error) {
                try {
                    await executeCommand('python -m ensurepip --upgrade', { silent: true });
                    await executeCommand('python -m venv venv', { silent: true });
                } catch (error) {
                    throw new Error('No se pudo crear el entorno virtual de Python');
                }
            }
        }

        // Actualizar pip e instalar dependencias silenciosamente
        const pythonBin = isWindows ? 'Scripts\\python.exe' : 'bin/python3';
        await executeCommand(`"${path.join(venvPath, pythonBin)}" -m pip install --upgrade pip --quiet`, { silent: true });
        await executeCommand(`"${path.join(venvPath, pythonBin)}" -m pip install -r requirements.txt --quiet`, { silent: true });
        await executeCommand('npm install --silent', { silent: true });

    } catch (error) {
        console.error('\n❌ Error durante la configuración:', error.message);
        process.exit(1);
    }
}

module.exports = setup;

if (require.main === module) {
    setup();
}