const express = require('express');
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  // Access the 'name' environment variable directly
  const name = process.env.name;

  // Check if the 'name' variable is set
  if (name) {
    res.send(`Hello, ${name}!`);
  } else {
    res.send("Hello, World!");
  }
});

app.get('/test/:name', (req, res) => {
  const param = req.params.name;

  res.json({
    "1": "Aman",
    "2": param
  });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
