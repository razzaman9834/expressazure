require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const { SmsClient } = require('@azure/communication-sms');
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



// Replace these with your Azure Communication Services connection string
const connectionString = process.env.EMAILCOMM;
const smsClient = new SmsClient(connectionString);

// Define an endpoint to send a test email
app.get('/send-email', async (req, res) => {
  try {
    const sendOptions = {
      from: 'DoNotReply@cc573b44-d35b-434a-9f93-f91636463ad7.azurecomm.net', // Replace with your email address
      to: ['razzaman9834@gmail.com'], // Replace with recipient email address
      subject: 'Test Email',
      body: 'This is a test email sent from your Express app using Azure Email service!',
    };

    // Send the email
    await smsClient.send({
      smsRecipients: [{ to: sendOptions.to[0] }],
      from: sendOptions.from,
      message: {
        subject: sendOptions.subject,
        body: [{ content: sendOptions.body }],
      },
    });

    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
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
