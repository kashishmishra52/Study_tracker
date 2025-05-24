// app.js
const express = require('express');
const path = require('path');
const app = express();
const mongoose=require('mongoose');
const MongoStore = require('connect-mongo');
const port = 3000;
const authroutes=require('./routes/authroutes');
const taskroutes=require('./routes/taskroutes');
const dashboardroutes=require('./routes/dashboardroutes');
const User=require('./models/user');
const Task = require('./models/task');
const session=require('express-session');
const db=require('./config/db');

app.use(session({
  secret: 'verysecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/study-simplify',  // replace with your DB name
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
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
app.use('/',taskroutes);
app.use('/',dashboardroutes);
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




// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
