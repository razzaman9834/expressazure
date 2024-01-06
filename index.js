
require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
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


app.get('/test', function (req, res) {
 
 
    res.send("Hello, World! test2");
 
});


app.get('/', function (req, res) {
  
    res.send("Hello, World!");
  
});

app.get('/test/:name', (req, res) => {
  const param = req.params.name;

  res.json({
    "1": "Aman",
    "2": param
  });
});


app.get('/testenv', (req, res) => {
  // Access the value from the environment variable
  const envValue = process.env.ENVVAL;

  res.json({
    "1": "Aman",
    "2": envValue
  });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});

