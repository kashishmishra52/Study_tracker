// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS) from the 'public' directory
app.use(express.static('public'));


// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/task-manager', (req, res) => {
    const tasks = []; // Replace with DB later
    res.render('task-manager', { tasks });
  });
  

app.get('/pomodoro', (req, res) => {
  res.render('pomodoro');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});
app.get('/login', (req, res) => {
    res.render('login');
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
