const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToMarkdown } = require('./converter.cjs');

// Custom storage configuration for Multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Extract the original file name without extension
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        // Get the original file extension
        const extension = path.extname(file.originalname);
        // Generate a unique name by adding the current date and time
        const uniqueSuffix = Date.now();
        // Assign the name with the original extension
        const filename = `${originalName}-${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

function startServer(port = 3002, retries = 5) {
    return new Promise((resolve, reject) => {
        const app = express();
        const PORT = port;

        app.use(cors());
        app.use(express.static(path.join(__dirname)));

        app.post('/convert', upload.single('file'), (req, res) => {
            try {
                const filePath = path.join(__dirname, req.file.path);
                convertToMarkdown(filePath, (err, markdown) => {
                    if (err) {
                        return res.status(500).send('Error converting the file.');
                    }
                    res.send({ markdown });
                });
            } catch (error) {
                return res.status(500).send('Error converting the file.');
            }
        });

        const server = app.listen(PORT, () => {
            // console.log(`Server running on port ${PORT}`);
            resolve({ port: PORT, app, server });
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE' && retries > 0) {
                console.warn(`\x1b[33m🔄 Port ${PORT} in use. Trying port ${PORT + 1}...\x1b[0m`);
                startServer(PORT + 1, retries - 1).then(resolve).catch(reject);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = { startServer };