require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const azureStorage = require('azure-storage');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_DB;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a simple mongoose model and schema
const Task = mongoose.model('Task', {
  name: String,
  description: String,
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 3 * 1024 * 1024 } });

// Azure Storage configuration
const blobService = azureStorage.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);

// Express route to fetch tasks from MongoDB
app.get('/tasks', async (req, res) => {
  try {
    // Query all tasks from the database
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/test', (req, res) => {
  res.send('Hello, World! test2');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test/:name', (req, res) => {
  const param = req.params.name;
  res.json({
    "1": "Aman",
    "2": param,
  });
});

app.get('/testenv', (req, res) => {
  const envValue = process.env.ENVVAL;
  res.json({
    "1": "Aman",
    "2": envValue,
  });
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const blobName = `uploads/${Date.now()}-${req.file.originalname}`;
  const stream = require('stream');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  blobService.createBlockBlobFromStream(
    process.env.AZURE_STORAGE_CONTAINER,
    blobName,
    bufferStream,
    req.file.size,
    (error, result, response) => {
      if (error) {
        console.error('Error uploading to Azure:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const fileUrl = blobService.getUrl(
        process.env.AZURE_STORAGE_CONTAINER,
        blobName,
        null,
        process.env.AZURE_STORAGE_ACCOUNT + '.blob.core.windows.net'
      );

      res.json({ success: true, fileUrl });
    }
  );
});

app.listen(port, () => {
  console.log('Server is running on port', port);
});
