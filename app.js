// app.js
const express = require('express');
const path = require('path');
const app = express();
const mongoose=require('mongoose');
const port = 3000;
const Task = require('./models/task');
const authroutes=require('./routes/authroutes');
const User=require('./models/user');
const session=require('express-session');
const db=require('./config/db');
app.use(session({
  secret: 'verysecretkey',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});


// Required for parsing form data
app.use(express.urlencoded({ extended: true }));  // <- This line
app.use(express.json());                          // <- For JSON data (optional but good to have)


// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS) from the 'public' directory
app.use(express.static('public'));


app.use('/',authroutes);
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
  // routes/index.js or app.js
app.get('/motivation', (req, res) => {
  res.render('motivation');
});
app.post("/add-task", async (req, res) => {
  const { title, subject, dueDate, description, priority } = req.body;
  await Task.create({
    userId: req.user.id,  // If user system exists
    title, subject, dueDate, description, priority
  });
  res.redirect("/task-manager");
});

app.post("/complete-task/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect("/task-manager");
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
