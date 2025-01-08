const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToMarkdown } = require('./converter.cjs');

function startServer() {
    return new Promise((resolve, reject) => {
        const app = express();
        const PORT = process.env.PORT || 3002;

        app.use(cors());
        app.use(express.static(path.join(__dirname)));

        const upload = multer({ dest: 'uploads/' });

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