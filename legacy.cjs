const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const { convertToMarkdown } = require('./converter.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración personalizada de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now();
        const filename = `${originalName}-${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const app = express();
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    // console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;