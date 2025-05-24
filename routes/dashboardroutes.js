const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const PomodoroSession = require('../models/pomodoro');
const moment = require('moment'); // for date handling
const { model } = require('mongoose');

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  const today = moment().startOf('day');
  const weekStart = moment().startOf('isoWeek');

  try {
    // Fetch Pomodoro sessions for today and this week
    const todaySessions = await PomodoroSession.find({
      userId,
      date: { $gte: today.toDate() }
    });

    const weekSessions = await PomodoroSession.find({
      userId,
      date: { $gte: weekStart.toDate() }
    });

    const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    // Fetch completed tasks
    const completedTasks = await Task.find({
      userId,
      completed: true
    });

    // All tasks for stats
    const allTasks = await Task.find({ userId });

    res.render('dashboard', {
      currentUser: req.session.user,
      todayTime,
      weekTime,
      tasksDone: completedTasks.length,
      allTasks
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports=router;