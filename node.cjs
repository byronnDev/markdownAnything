const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToMarkdown } = require('./converter.cjs');

// Configuración personalizada de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Extraer el nombre original del archivo sin la extensión
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        // Obtener la extensión original del archivo
        const extension = path.extname(file.originalname);
        // Generar un nombre único agregando la fecha y hora actual
        const uniqueSuffix = Date.now();
        // Asignar el nombre con la extensión original
        const filename = `${originalName}-${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

function startServer() {
    return new Promise((resolve, reject) => {
        const app = express();
        const PORT = process.env.PORT || 3002;

        app.use(cors());
        app.use(express.static(path.join(__dirname)));

        app.post('/convert', upload.single('file'), (req, res) => {
            const filePath = path.join(__dirname, req.file.path);
            convertToMarkdown(filePath, (err, markdown) => {
                if (err) {
                    return res.status(500).send('Error al convertir el archivo.');
                }
                res.send({ markdown });
            });
        });

        const server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            resolve({ port: PORT, app, server });
        });

        server.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = { startServer };