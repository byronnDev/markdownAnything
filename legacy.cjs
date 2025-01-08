const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const { convertToMarkdown } = require('./converter.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;