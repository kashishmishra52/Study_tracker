const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');


router.get('/task-manager', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const tasks = await Task.find({ userId: req.session.user.id }).sort({ dueDate: 1 });
  res.render('task-manager', { tasks });
});
router.post("/add-task", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { title, subject, dueDate, description, priority } = req.body;

  await Task.create({
    userId: req.session.user.id,
    title,
    subject,
    dueDate,
    description,
    priority
  });

  res.redirect("/task-manager");
});
router.post("/complete-task/:id", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.session.user.id
  });

  if (!task) {
    return res.status(403).send("Task not found or unauthorized");
  }

  task.completed = true;
  await task.save();

  res.redirect("/task-manager");
});
module.exports=router;
